// Rigid wall joints measured from mesh cap edges, in millimetres.
export const identity = () => [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
export const multiply = (a,b) => a.map((r,i)=>r.map((_,j)=>r.reduce((s,v,k)=>s+v*b[k][j],0)));
export const point = (m,p) => m.slice(0,3).map(r=>r[0]*p[0]+r[1]*p[1]+r[2]*p[2]+r[3]);
export function rotate(deg,p=[0,0,0]) {const a=deg*Math.PI/180,c=Math.cos(a),s=Math.sin(a);return [[c,0,s,p[0]-c*p[0]-s*p[2]],[0,1,0,0],[-s,0,c,p[2]+s*p[0]-c*p[2]],[0,0,0,1]];}
export function move(rows,m) {for(const r of rows) r.vertices_mm=r.vertices_mm.map(p=>point(m,p));}
const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const sub = (a,b) => a.map((x,i)=>x-b[i]);
const dot = (a,b) => a.reduce((s,x,i)=>s+x*b[i],0);
export function normal(row) {
 // Use a broad wall cap, not a new bevel or a long, narrow thickness face.
 // Catalog walls are within 12 degrees of XY before seating.
 let best=[0,0,0],fallback=[0,0,0];
 for(const f of row.triangles){const v=f.map(i=>row.vertices_mm[i]);const n=cross(sub(v[1],v[0]),sub(v[2],v[0])),area=Math.hypot(...n);
  if(area>Math.hypot(...fallback))fallback=n;
  if(Math.abs(n[2])>.9*area&&area>Math.hypot(...best))best=n;
 }
 if(!Math.hypot(...best))best=fallback;
 const l=Math.hypot(...best)*Math.sign(best[2]||1);return best.map(x=>x/l);
}
export function bounds(rows) {const lo=[Infinity,Infinity,Infinity],hi=lo.map(x=>-x);for(const r of rows)for(const v of r.vertices_mm)for(let i=0;i<3;i++){lo[i]=Math.min(lo[i],v[i]);hi[i]=Math.max(hi[i],v[i]);}return {lo,hi};}
// Boundary edges of the outward planar cap. Coordinate keys weld duplicated mesh vertices.
export function verticalEdges(row) {
 const n=normal(row), edges=new Map();
 const key=p=>p.map(x=>x.toFixed(4)).join(',');
 for(const f of row.triangles){const v=f.map(i=>row.vertices_mm[i]);const nn=cross(sub(v[1],v[0]),sub(v[2],v[0]));if(dot(nn,n)<Math.hypot(...nn)*.99999)continue;
  for(let i=0;i<3;i++){const a=v[i],b=v[(i+1)%3],k=[key(a),key(b)].sort().join('|');const old=edges.get(k);edges.set(k,{a,b,count:(old?.count??0)+1});}}
 const segments=[];
 for(const {a,b,count} of edges.values())if(count===1&&Math.abs(a[0]-b[0])<.001&&Math.abs(a[1]-b[1])>.01)segments.push({x:(a[0]+b[0])/2,lo:Math.min(a[1],b[1]),hi:Math.max(a[1],b[1])});
 segments.sort((a,b)=>a.x-b.x||a.lo-b.lo);
 const merged=[];
 for(const e of segments){const old=merged.find(q=>Math.abs(q.x-e.x)<.001&&e.lo<=q.hi+.001&&e.hi>=q.lo-.001);if(old){old.lo=Math.min(old.lo,e.lo);old.hi=Math.max(old.hi,e.hi);}else merged.push({...e});}
 return merged.filter(e=>e.hi-e.lo>20);
}
export function tabEdges(flap,positive) {const b=bounds([flap]);const x=positive?b.hi[0]:b.lo[0];const edges=verticalEdges(flap).filter(e=>Math.abs(e.x-x)<.2).sort((a,b)=>a.lo-b.lo);if(edges.length!==3)throw Error(`${flap.id}: expected three tab tip edges, got ${edges.length}`);return edges;}
export function matchSocket(flap,receiver,positive) {
 const tabs=tabEdges(flap,positive),b=bounds([receiver]),edge=positive?b.lo[0]:b.hi[0];
 const candidates=verticalEdges(receiver).filter(e=>(e.x-edge)*(positive?1:-1)>40&&(e.x-edge)*(positive?1:-1)<130);
 let best=null;
 for(const e of candidates){const dy=(e.lo+e.hi-tabs[0].lo-tabs[0].hi)/2,dx=e.x-tabs[0].x;const pairs=tabs.map(t=>candidates.map(q=>({q,error:Math.abs(q.x-t.x-dx)+Math.abs(q.lo-t.lo-dy)+Math.abs(q.hi-t.hi-dy)})).sort((a,b)=>a.error-b.error)[0]);if(pairs.some(p=>!p))continue;const error=pairs.reduce((s,p)=>s+p.error,0);if(!best||error<best.error)best={dx,dy,error,tabs,sockets:pairs.map(p=>p.q)};}
 if(!best||best.error>3)throw Error(`${flap.id} -> ${receiver.id}: reciprocal notch edges not found (${best?.error})`);
 const fb=bounds([flap]);best.dz=(b.lo[2]+b.hi[2]-fb.lo[2]-fb.hi[2])/2;return best;
}

export function assembleJoints(rows,fold,{birthday=false}={}) {
 const transforms=new Map(rows.map(r=>[r,identity()]));
 const applyRows=(rs,m)=>{move(rs,m);for(const r of rs)transforms.set(r,multiply(m,transforms.get(r)));};
 const joints=fold.joints.map(j=>{
  const flap=rows.find(r=>r.id.startsWith(j.host)&&r.id.includes('flap'));
  const donor=rows.find(r=>r.id===j.host+'/body'||r.id===j.host);
  if(!flap||!donor)throw Error(`Missing joint meshes: ${j.host}`);
  // Sample the shared split plane, as in catalog-all/flap_fold.py.
  const points=[];
  for(const f of donor.triangles)for(let i=0;i<3;i++){const a=donor.vertices_mm[f[i]],b=donor.vertices_mm[f[(i+1)%3]];if(a[0]!==b[0]&&Math.min(a[0],b[0])<=j.x&&Math.max(a[0],b[0])>=j.x)points.push(a[2]+(b[2]-a[2])*(j.x-a[0])/(b[0]-a[0]));}
  const db=bounds([donor]);const z=points.length?[Math.min(...points),Math.max(...points)]:[db.lo[2],db.hi[2]];
  return {...j,donor,flap,positive:j.flap_positive!==false,rootFaces:z.map(z=>[j.x,0,z])};
 });
 if(birthday){
  // Flatten each supported wall with its own exact face normal. Flaps are still
  // attached to the donor here; receiver ownership starts after seating.
  for(const g of [0,2]){
   const wall=rows.find(r=>r.rig_group===g&&r.role==='back'&&r.id.includes('bottom')&&!r.id.includes('flap'));
   const n=normal(wall),yaw=Math.atan2(n[0],n[2])*180/Math.PI;
   const rs=rows.filter(r=>r.rig_group===g&&!r.id.includes('flap'));
   const attached=joints.filter(j=>j.donor.rig_group===g).map(j=>j.flap);
   applyRows([...rs,...attached],rotate(-yaw));
   // These catalog accessories were world-aligned, not wall-aligned.
   for(const part of new Set(rs.filter(r=>/stabilizer|topper/.test(r.part_id)).map(r=>r.part_id))){const rr=rs.filter(r=>r.part_id===part),b=bounds(rr);applyRows(rr,rotate(yaw,b.lo.map((v,i)=>(v+b.hi[i])/2)));}
   // The right top was displaced through the panel plane in the source.
   const top=rs.find(r=>r.role==='back'&&r.id.includes('top')&&!r.id.includes('topper'));
   if(top){const a=bounds([wall]),b=bounds([top]),m=identity();m[2][3]=(a.lo[2]+a.hi[2]-b.lo[2]-b.hi[2])/2;applyRows(rs.filter(r=>r.part_id===top.part_id),m);}
   // Preserve in-plane artwork registration; seat the front on the back's
   // glue face. The catalog has a 0.91 mm depth overlap on three narrow plies.
   for(const back of rs.filter(r=>r.role==='back'&&/narrow/.test(r.id))){
    const fronts=rs.filter(r=>r.part_id===back.part_id&&r.role==='front');
    if(fronts.length){const m=identity();m[2][3]=bounds([back]).hi[2]-bounds(fronts).lo[2];applyRows(fronts,m);}
   }
  }
 }
 for(const j of joints){
  const choices=[];
  for(const r of rows.filter(r=>r.rig_group===j.flap.rig_group&&r.role==='back'&&!r.id.includes('flap'))){try{const fit=matchSocket(j.flap,r,j.positive);choices.push({r,fit,distance:Math.hypot(fit.dx,fit.dy,fit.dz)});}catch{}}
  choices.sort((a,b)=>a.distance-b.distance);if(!choices.length)throw Error(`No receiver for ${j.flap.id}`);
  j.receiver=choices[0].r;
 }
 const fixed=new Set([1]);
 while(joints.some(j=>!j.seated)){
  let progress=false;
  for(const j of joints){if(j.seated)continue;const dg=j.donor.rig_group,rg=j.receiver.rig_group;if(fixed.has(dg)===fixed.has(rg))continue;
   const fit=matchSocket(j.flap,j.receiver,j.positive),moving=fixed.has(dg)?rg:dg,sgn=moving===dg?1:-1,m=identity();[fit.dx,fit.dy,fit.dz].forEach((v,i)=>m[i][3]=sgn*v);
   // Move each group's own flap with its donor until all joints are seated.
   const rr=rows.filter(r=>r.rig_group===moving&&!r.id.includes('flap'));
   rr.push(...joints.filter(q=>q.donor.rig_group===moving).map(q=>q.flap));applyRows(rr,m);
   j.seated=true;fixed.add(moving);progress=true;
  }
  if(!progress)throw Error('Joint graph is disconnected or cyclic');
 }
 for(const j of joints){j.rootFaces=j.rootFaces.map(p=>point(transforms.get(j.donor),p));j.fit=matchSocket(j.flap,j.receiver,j.positive);if(Math.hypot(j.fit.dx,j.fit.dy,j.fit.dz)>.02)throw Error(`Joint moved after seating: ${j.flap.id}`);}
 return {joints,transforms};
}

export function foldJoints(joints,fold,layout) {
 // Front is +Z in these kits. Concave brings both wings toward the front;
 // source rig-group numbering is not a spatial direction (Birthday is reversed).
 const matrices=new Map([[1,identity()]]),depths=new Map([[1,0]]),centres=new Map();
 for(const j of joints)for(const row of [j.donor,j.receiver]){
  const b=bounds([row]),g=row.rig_group,list=centres.get(g)??[];
  list.push((b.lo[0]+b.hi[0])/2);centres.set(g,list);
 }
 const centre=g=>centres.get(g).reduce((a,b)=>a+b,0)/centres.get(g).length;
 while(matrices.size<fold.groups.length){let progress=false;for(const j of joints){
  const d=j.donor.rig_group,r=j.receiver.rig_group;
  if(matrices.has(d)===matrices.has(r))continue;
  const inner=matrices.has(d)?d:r,outer=inner===d?r:d,depth=depths.get(inner)+1;
  const side=centre(outer)<centre(1)?1:-1;
  const angle=layout.id==='straight'?0:layout.id==='135-forward'?45*side:layout.id==='135-backward'?-45*side:45*(depth%2?1:-1);
  matrices.set(outer,multiply(matrices.get(inner),rotate(angle,j.hinge)));
  depths.set(outer,depth);progress=true;
 }if(!progress)throw Error('Cannot fold joint graph');}
 return matrices;
}
