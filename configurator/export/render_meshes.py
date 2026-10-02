"""Offline render of delivered GLB triangles posed by the viewer's three.js code.

No browser, UI or network is used. NumPy supplies a depth buffer; Pillow loads
registered textures and writes PNGs. Input is check_kit.mjs's decoded mesh cache.
Usage: .venv/bin/python configurator/export/render_meshes.py birthday [case]
"""
from pathlib import Path
import json,sys,time,hashlib
import numpy as np
from PIL import Image,ImageDraw,ImageFilter
ROOT=Path(__file__).resolve().parents[2]
D=ROOT/'configurator/research/joints'/sys.argv[1]
data=json.loads((D/'cache/render-data.json').read_text())
assert hashlib.sha256((D/'kit.json').read_bytes()).hexdigest()==data['kit_sha256'],'render cache is stale'
selected=sys.argv[2:]
captures=json.loads((D/'captures.json').read_text())['captures'] if selected and (D/'captures.json').exists() else []
W,H=1920,1200
textures={}
for part,prims in data['parts'].items():
    for p in prims:
        p['vertices']=np.array(p['vertices'],dtype=np.float64)
        p['triangles']=np.array(p['triangles'],dtype=np.int32)
        p['uv']=np.array(p['uv'],dtype=np.float64) if p['uv'] else None
        if p['image'] and p['image'] not in textures:textures[p['image']]=np.array(Image.open(D/p['image']).convert('RGB'))

def linear_to_srgb(v):return np.where(v<=.0031308,v*12.92,1.055*v**(1/2.4)-.055)

def render(name,instances,rear=False,close=False):
    start=time.monotonic();primitives=[];points=[]
    kit=json.loads((D/'kit.json').read_text())
    detail=kit['joints'][0] if close else None
    if detail:instances=[i for i in instances if i['key'] in [detail['donor'],detail['receiver'],detail['flap']]]
    for instance in instances:
        m=np.array(instance['matrix']).reshape(4,4).T
        for source_prim in data['parts'][instance['part']]:
            prim=source_prim
            if close:
                if 'back' not in prim['ply_id'] or 'patch' in prim['ply_id']:continue
                rgb=[.88,.30,.09] if instance['key']==detail['flap'] else [.30,.56,.75] if instance['key']==detail['receiver'] else [.66,.67,.63]
                prim={**prim,'image':None,'color':[*(np.array(rgb)**2.2),1]}
            v=prim['vertices']@m[:3,:3].T+m[:3,3]
            primitives.append((v,prim));points.append(v)
    allv=np.vstack(points);lo,hi=allv.min(0),allv.max(0);target=(lo+hi)/2
    direction=np.array([1.2,1.3,-3.0] if rear else [1.4,1.6,4.5],dtype=float)
    if close:
        joint=detail
        flap=next(i for i in instances if i['key']==joint['flap']);m=np.array(flap['matrix']).reshape(4,4).T
        check=json.loads((D/'mesh-check.json').read_text())
        measured=next(j for t in check['tests'] if t['case']=='base-straight' for j in t['joints'] if j['flap']==joint['flap'])
        target=np.array(joint['hinge_mm']);target[1]=measured['tabs'][-1]['centre_in_receiver_mm'][1];target=target@m[:3,:3].T+m[:3,3]
        direction=np.array([.4,.28,-1.0]);
    direction/=np.linalg.norm(direction)
    right=np.cross([0,1,0],direction);right/=np.linalg.norm(right);up=np.cross(direction,right)
    basis=np.array([right,up,direction]).T
    q=(allv-target)@basis
    if not close:
        # Centre the projected bounds, including asymmetric freestanding extras.
        target+=((q.min(0)+q.max(0))/2)@basis.T
    scale=min(W/(np.ptp(q[:,0])*1.10),H/(np.ptp(q[:,1])*1.13)) if not close else W/520
    offset=np.array([W/2,H/2])
    def project(v):
        q=(v-target)@basis
        return np.c_[q[:,0]*scale+offset[0],-q[:,1]*scale+offset[1],q[:,2]]
    color=np.zeros((H,W,3),dtype=np.uint8);color[:]=[250,250,248]
    # Ground shadows are projected from these same triangles, not painted in.
    if not close:
        shadow=Image.new('L',(W,H));draw=ImageDraw.Draw(shadow)
        for v,p in primitives:
            floor=v.copy();floor[:,0]-=.32*floor[:,1];floor[:,2]-=.22*floor[:,1];floor[:,1]=0
            q=project(floor)
            for t in p['triangles']:
                xy=q[t,:2]
                if np.ptp(xy[:,0])*np.ptp(xy[:,1])>1:draw.polygon([tuple(x) for x in xy],fill=40)
        shade=np.array(shadow.filter(ImageFilter.GaussianBlur(7)),dtype=float)/255
        color=(color*(1-shade[:,:,None])).astype(np.uint8)
    depth=np.full((H,W),-np.inf,dtype=np.float64)
    light=np.array([-.3,.65,.7]);light/=np.linalg.norm(light)
    for v,prim in primitives:
        projected=project(v);tri=prim['triangles'];uv=prim['uv'];texture=textures.get(prim['image'])
        factor=np.array(prim['color'][:3]);base=linear_to_srgb(factor)*255
        for ids in tri:
            world=v[ids];n=np.cross(world[1]-world[0],world[2]-world[0]);length=np.linalg.norm(n)
            if length<1e-9:continue
            n/=length
            if n@direction<=0:continue
            a,b,c=projected[ids]
            x0=max(0,int(np.floor(min(a[0],b[0],c[0]))));x1=min(W-1,int(np.ceil(max(a[0],b[0],c[0]))))
            y0=max(0,int(np.floor(min(a[1],b[1],c[1]))));y1=min(H-1,int(np.ceil(max(a[1],b[1],c[1]))))
            if x0>x1 or y0>y1:continue
            denom=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1])
            if abs(denom)<1e-10:continue
            yy,xx=np.mgrid[y0:y1+1,x0:x1+1];xx=xx+.5;yy=yy+.5
            wa=((b[1]-c[1])*(xx-c[0])+(c[0]-b[0])*(yy-c[1]))/denom
            wb=((c[1]-a[1])*(xx-c[0])+(a[0]-c[0])*(yy-c[1]))/denom;wc=1-wa-wb
            z=wa*a[2]+wb*b[2]+wc*c[2]
            old=depth[y0:y1+1,x0:x1+1];mask=(wa>=-1e-8)&(wb>=-1e-8)&(wc>=-1e-8)&(z>old)
            if not mask.any():continue
            # Keep printed colours close to the baked source. Felt thickness
            # faces get the same diffuse lighting and remain visibly solid.
            intensity=.70+.22*max(0,n@light)+.08*max(0,n@(-light))
            if texture is not None:
                t=wa[mask,None]*uv[ids[0]]+wb[mask,None]*uv[ids[1]]+wc[mask,None]*uv[ids[2]]
                tx=np.clip(t[:,0]*(texture.shape[1]-1),0,texture.shape[1]-1);ty=np.clip(t[:,1]*(texture.shape[0]-1),0,texture.shape[0]-1)
                ix,iy=tx.astype(int),ty.astype(int);jx=np.minimum(ix+1,texture.shape[1]-1);jy=np.minimum(iy+1,texture.shape[0]-1)
                fx=(tx-ix)[:,None];fy=(ty-iy)[:,None]
                rgb=(texture[iy,ix]*(1-fx)+texture[iy,jx]*fx)*(1-fy)+(texture[jy,ix]*(1-fx)+texture[jy,jx]*fx)*fy
                rgb*=factor*intensity
            else:rgb=np.broadcast_to(base*intensity,(mask.sum(),3))
            color[y0:y1+1,x0:x1+1][mask]=np.clip(rgb,0,255).astype(np.uint8);old[mask]=z[mask]
    image=Image.fromarray(color).resize((1600,1000),Image.Resampling.LANCZOS)
    image.save(D/(name+'.png'))
    captures[:]=[c for c in captures if c['file']!=name+'.png' and c['kit_sha256']==data['kit_sha256']]
    captures.append({'file':name+'.png','sha256':hashlib.sha256((D/(name+'.png')).read_bytes()).hexdigest(),'kit_sha256':data['kit_sha256'],'camera_direction':direction.tolist(),'target_mm':target.tolist(),'pixels':[1600,1000],'joint_highlight':close})
    (D/'captures.json').write_text(json.dumps({'renderer':'Offline decoded GLB triangles; viewer three.js transforms; NumPy depth buffer and Pillow textures. Joint details hide other plies and use role colours.','captures':captures},indent=2))
    print(name,round(time.monotonic()-start,1),'seconds',flush=True)

for name,instances in data['scenes'].items():
    if not name.startswith(('base-','extras-')):continue
    if selected and name not in selected:continue
    render(name,instances)
if not selected or '--details' in selected:
    render('rear-concertina',data['scenes']['base-concertina'],rear=True)
    render('joint-closeup-straight',data['scenes']['base-straight'],rear=True,close=True)
    render('joint-closeup-concertina',data['scenes']['base-concertina'],rear=True,close=True)
