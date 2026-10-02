"""Apply the universal 90-degree/2 mm hinge rule and derive declared link variants.

Input/output are temporary JSON files written by export_kit.mjs. Dependencies are
already declared by this repository: numpy, shapely and manifold3d.
"""
from pathlib import Path
import json,sys
import numpy as np
from manifold3d import Manifold
from shapely.geometry import Polygon
from shapely.ops import unary_union
from shapely.affinity import translate as translate_profile
ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'src'))
from screenery.material import mesh_solid,profile_solid

payload=json.loads(Path(sys.argv[1]).read_text());rows={r['id']:r for r in payload['rows']}
rules=json.loads((ROOT/'ground truth/rules.json').read_text())['constants']
remainder=rules['vgroove_remainder_mm']['hinge']
assert rules['vgroove_included_angle_deg']['value']==90

def solid(row):return mesh_solid(row['vertices_mm'],row['triangles'])
def bb(row):return np.array([np.min(row['vertices_mm'],axis=0),np.max(row['vertices_mm'],axis=0)])
def write(row,s):
    old=np.array(row['vertices_mm']);faces=np.array(row['triangles']);art=faces[row.get('art_faces',[])]
    normals=np.cross(old[art[:,1]]-old[art[:,0]],old[art[:,2]]-old[art[:,0]]) if len(art) else []
    mesh=s.to_mesh64();v=np.asarray(mesh.vert_properties)[:,:3];f=np.asarray(mesh.tri_verts)
    if row.get('uv'):
        # Existing cap UVs are affine. Ignore thickness so Boolean vertices on
        # the new recess inherit the same registered XY artwork frame.
        A=np.c_[old[:,:2],np.ones(len(old))];uv=np.array(row['uv']);aff=np.linalg.lstsq(A,uv,rcond=None)[0]
        assert np.max(abs(A@aff-uv))<1e-4,(row['id'],'non-affine artwork')
        row['uv']=(np.c_[v[:,:2],np.ones(len(v))]@aff).tolist()
    if len(normals):
        signs=set(np.sign(normals[:,2]).astype(int))-{0};n=np.cross(v[f[:,1]]-v[f[:,0]],v[f[:,2]]-v[f[:,0]])
        cap=np.abs(n[:,2])/np.maximum(np.linalg.norm(n,axis=1),1e-20)>.99999
        row['art_faces']=np.flatnonzero(cap & np.isin(np.sign(n[:,2]),list(signs))).tolist()
    row['vertices_mm']=v.tolist();row['triangles']=f.tolist()
    return row

def groove(x,lo,hi,ylo,yhi,front_positive):
    depth=hi-lo-remainder
    assert depth>0
    outside=lo if front_positive else hi
    apex=outside+(depth if front_positive else -depth)
    # XZ profile extruded along -Y. The cutter opens at the back exterior.
    mouth=outside+(-1 if front_positive else 1)
    p=[[x-depth-1,mouth],[x+depth+1,mouth],[x,apex]]
    cutter=profile_solid(p,[],yhi-ylo).transform([[1,0,0,0],[0,0,-1,yhi],[0,1,0,0]])
    axis=hi-remainder/2 if front_positive else lo+remainder/2
    return cutter,[x,0,axis]

# Match the complete reciprocal contour after the straight tip-edge fit. Some
# catalog triangulations have different curve sampling at the notch shoulders;
# equal straight-edge midpoints alone do not prove material containment.
def cap_profile(row):
    v=np.array(row['vertices_mm']);f=np.array(row['triangles'])
    n=np.cross(v[f[:,1]]-v[f[:,0]],v[f[:,2]]-v[f[:,0]])
    return unary_union([Polygon(v[t,:2]) for t in f[n[:,2]>np.linalg.norm(n,axis=1)*.99999]])

def best_y(flap,receiver):
    area=lambda dy:translate_profile(flap,yoff=dy).intersection(receiver).area
    before=area(0)
    if before<.1:return 0,before,before
    lo,hi=-2.,2.;ratio=(5**.5-1)/2
    a=hi-ratio*(hi-lo);b=lo+ratio*(hi-lo);fa,fb=area(a),area(b)
    for _ in range(34):
        if fa<fb:hi,b,fb=b,a,fa;a=hi-ratio*(hi-lo);fa=area(a)
        else:lo,a,fa=a,b,fb;b=lo+ratio*(hi-lo);fb=area(b)
    dy=(lo+hi)/2
    return dy,before,area(dy)

offsets={};seating=[];fixed={1};pending=list(payload['joints'])
while pending:
    for j in pending:
        dg,rg=rows[j['donor']]['rig_group'],rows[j['receiver']]['rig_group']
        if (dg in fixed)==(rg in fixed):continue
        dy,before,after=best_y(cap_profile(rows[j['flap']]),cap_profile(rows[j['receiver']]))
        group=rg if dg in fixed else dg;delta=np.array([0,dy if group==dg else -dy,0])
        own_flaps={q['flap'] for q in payload['joints'] if rows[q['donor']]['rig_group']==group}
        for row in rows.values():
            if (row['rig_group']==group and 'flap' not in row['id']) or row['id'] in own_flaps:
                row['vertices_mm']=(np.array(row['vertices_mm'])+delta).tolist()
        for q in payload['joints']:
            if rows[q['donor']]['rig_group']==group:q['root_faces']=(np.array(q['root_faces'])+delta).tolist()
        offsets[group]=(np.array(offsets.get(group,[0,0,0]))+delta).tolist()
        seating.append({'flap':j['flap'],'receiver':j['receiver'],'vertical_refinement_mm':dy,'overlap_before_mm2':before,'overlap_after_mm2':after})
        fixed.add(group);pending.remove(j);break
    else:raise ValueError('Joint graph cannot be seated')

records=[]
repairs=[]
for j in payload['joints']:
    body,flap=rows[j['donor']],rows[j['flap']]
    b=bb(body);root=np.mean(j['root_faces'],axis=0);x=float(root[0])
    front=next(r for r in rows.values() if r['part_id']==body['part_id'] and r['role']=='front')
    front_positive=bb(front)[:,2].mean()>b[:,2].mean()
    # Rejoin the old display split, then split in the now-flat panel plane.
    # This removes Birthday's oblique world-X partition, not a native contour.
    whole=solid(body)+solid(flap)
    fbb=bb(flap);cutter,axis=groove(x,b[0,2],b[1,2],fbb[0,1],fbb[1,1],front_positive)
    whole=whole-cutter
    positive,negative=whole.split_by_plane([1,0,0],x)
    donor,tab=(negative,positive) if j['positive'] else (positive,negative)
    write(body,donor);write(flap,tab)
    # The banked Fire Station receipt rejects inward folding because this
    # middle-ply edge crosses the native back-ply hinge. Remove that measured
    # overhang in the kit only; do not move the artwork or alter the stock.
    if payload['design']=='fire-station' and body['id']=='door panel > bottom right subpanel||back||':
        middle=next(r for r in rows.values() if r['part_id']==body['part_id'] and r['role']=='middle')
        excess=float(bb(middle)[1,0]-x)
        assert 0<excess<1,('unexpected Fire Station hinge overhang',excess)
        before=solid(middle);_,kept=before.split_by_plane([1,0,0],x)
        write(middle,kept)
        repairs.append({'row':middle['id'],'operation':'trim middle-ply overhang to native flap root','maximum_trim_mm':excess,'removed_volume_mm3':before.volume()-kept.volume(),'scope':'configurator kit only'})
    j['hinge_mm']=axis
    records.append({'donor':body['id'],'flap':flap['id'],'hinge_mm':axis,'stock_mm':float(b[1,2]-b[0,2]),'remainder_mm':remainder,'groove_degrees':90})

variants=[]
for link in payload['chain']:
    # Derive each intermediate end from this design's declared mating joint.
    # Space reverses Birthday's donor/receiver ownership on both sides.
    j=next(j for j in payload['joints'] if j['flap']==link['flap'])
    edge=0 if link['side']=='left' else 1
    if link['receiver_moves']:
        receiver=rows[j['receiver']];b=bb(receiver);x=float(b[edge,0])
        fbb=bb(rows[j['flap']])
        front=next(r for r in rows.values() if r['part_id']==receiver['part_id'] and r['role']=='front')
        cutter,axis=groove(x,b[0,2],b[1,2],fbb[0,1],fbb[1,1],bb(front)[:,2].mean()>b[:,2].mean())
        v=json.loads(json.dumps(receiver));v['id']+='-linked';write(v,solid(receiver)-cutter)
        variants.append({'source':receiver['id'],'row':v,'reason':'outgoing flap-root groove; flap copied from declared donor'})
    else:
        # Copy only the exterior-connected receiving void, including curved
        # mouths. Keep unrelated enclosed artwork cutouts on their source.
        source=rows[j['receiver']];target=rows[j['donor']]
        sb,tb=bb(source),bb(target);step=float(tb[edge,0]-sb[edge,0]);x=sb[edge,0]
        band_lo=np.array([x-10 if edge==0 else x-130,sb[0,1]+5,sb[0,2]])
        band_hi=np.array([x+130 if edge==0 else x+10,sb[1,1]-5,sb[1,2]])
        band=Manifold.cube((band_hi-band_lo).tolist()).translate(band_lo.tolist())
        void=band-solid(source)
        sockets=[s for s in void.decompose() if (s.bounding_box()[0]<x-1 if edge==0 else s.bounding_box()[3]>x+1)]
        assert len(sockets)==1,'socket mouths must connect to the exterior'
        # Extend through both target faces to avoid zero-thickness Boolean caps.
        centre=float(sb[:,2].mean());factor=float((tb[1,2]-tb[0,2]+2)/(sb[1,2]-sb[0,2]))
        cutter=sockets[0].translate([0,0,-centre]).scale([1,1,factor]).translate([step,0,float(tb[:,2].mean())])
        v=json.loads(json.dumps(target));v['id']+='-linked';write(v,solid(target)-cutter)
        variants.append({'source':target['id'],'row':v,'reason':'three receiving notches copied from declared receiver','source_socket':source['id'],'translation_mm':[step,0,0]})

Path(sys.argv[2]).write_text(json.dumps({'rows':list(rows.values()),'joints':payload['joints'],'variants':variants,'hinges':records,'seating':seating,'group_offsets':offsets,'repairs':repairs},separators=(',',':')))
