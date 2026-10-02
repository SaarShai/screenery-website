// Check the delivered GLB triangles, not exporter bounds. Also write portable
// uncompressed GLBs for Blender evidence renders.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import { textureCompress } from '@gltf-transform/functions';
import sharp from 'sharp';
import { normal, bounds, tabEdges, verticalEdges } from './joints.mjs';
import { partInstances } from '../app/src/lib/assembly.ts';
import * as THREE from '../app/node_modules/three/build/three.module.js';
const repo=path.resolve(import.meta.dirname,'../..');
const design=process.argv[2]??'birthday';
const dir=path.join(repo,'public/configurator/kits',design);
const out=path.join(repo,'configurator/research/joints',design);
await fs.mkdir(out,{recursive:true});
await MeshoptDecoder.ready;
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
const kit=JSON.parse(await fs.readFile(path.join(dir,'kit.json')));
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const kitHash=hash(await fs.readFile(path.join(dir,'kit.json')));
const assets={};
const geometry=new Map();
const renderParts={};
await fs.mkdir(path.join(out, 'cache'), {recursive:true});
const transform=(m,p)=>[0,1,2].map(i=>m[i]*p[0]+m[i+4]*p[1]+m[i+8]*p[2]+m[i+12]);
for(const part of kit.parts){assets[part.glb]=hash(await fs.readFile(path.join(dir,part.glb)));const doc=await io.read(path.join(dir,part.glb));const rows=new Map();
 const primitives=[];
 for(const node of doc.getRoot().listNodes()){if(!node.getMesh())continue;const m=node.getWorldMatrix();for(const primitive of node.getMesh().listPrimitives()){
  const name=primitive.getMaterial().getName().replace(/:(felt|art)$/,'');
  if(!rows.has(name))rows.set(name,{id:name,vertices_mm:[],triangles:[]});const row=rows.get(name),base=row.vertices_mm.length;
  const pos=primitive.getAttribute('POSITION'),idx=primitive.getIndices().getArray();
  for(let i=0;i<pos.getCount();i++)row.vertices_mm.push(transform(m,pos.getElement(i,[])));
  for(let i=0;i<idx.length;i+=3)row.triangles.push([idx[i]+base,idx[i+1]+base,idx[i+2]+base]);
  const material=primitive.getMaterial(),texture=material.getBaseColorTexture();
  let image=null;
  if(texture){image=`cache/${part.id}-${primitives.length}.png`;await sharp(texture.getImage()).png().toFile(path.join(out,image));}
  const uv=primitive.getAttribute('TEXCOORD_0');
  primitives.push({ply_id:name,vertices:row.vertices_mm.slice(base),triangles:Array.from({length:idx.length/3},(_,i)=>Array.from(idx.slice(i*3,i*3+3))),
    uv:uv?Array.from({length:uv.getCount()},(_,i)=>uv.getElement(i,[])):null,image,color:material.getBaseColorFactor()});
 }}geometry.set(part.id,[...rows.values()]);renderParts[part.id]=primitives;
 for(const ext of doc.getRoot().listExtensionsUsed())if(['EXT_meshopt_compression','KHR_mesh_quantization'].includes(ext.extensionName))ext.dispose();
 await doc.transform(textureCompress({encoder:sharp,targetFormat:'png'}));
 await io.write(path.join(out,'cache',part.id+'.glb'),doc);
}
await fs.writeFile(path.join(out,'cache','geometry.json'),JSON.stringify(Object.fromEntries(geometry)));
const inside=(row,x,y)=>row.triangles.some(f=>{
 const [a,b,c]=f.map(i=>row.vertices_mm[i]);const area=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);if(Math.abs(area)<1e-7)return false;
 const u=((b[0]-x)*(c[1]-y)-(b[1]-y)*(c[0]-x))/area;
 const v=((c[0]-x)*(a[1]-y)-(c[1]-y)*(a[0]-x))/area;return u>1e-7&&v>1e-7&&1-u-v>1e-7;
});
const rowFor = (part,role) => geometry.get(part.id).find(r=>part.plies.some(p=>p.id===r.id&&p.role===role&&!/leaf|patch/.test(r.id)));
const partMap = new Map(kit.parts.map(p=>[p.id,p]));
function inspectJoint(j,byKey) {
  const fi=byKey.get(j.flapKey),di=byKey.get(j.donorKey),ri=byKey.get(j.receiverKey);
  const f=geometry.get(fi.part.id)[0],donor=rowFor(di.part,'back'),receiver=rowFor(ri.part,'back');
  const fb=bounds([f]),rb=bounds([receiver]);
  const positive=(fb.lo[0]+fb.hi[0])/2>j.hinge_mm[0];
  const tips=tabEdges(f,positive),local=ri.matrix.clone().invert().multiply(fi.matrix);
  const transformPoint=p=>new THREE.Vector3(...p).applyMatrix4(local).toArray();
  const edges=verticalEdges(receiver);
  const tabs=tips.map(t=>{
   // The tab's geometric centre can be its finger hole. A second probe must
   // lie in actual flap material and in empty receiving-notch space.
   const x=t.x+(positive?-1:1)*35,centre=[x,(t.lo+t.hi)/2,(fb.lo[2]+fb.hi[2])/2],probe=[x,t.lo+20,centre[2]];
   const c=transformPoint(centre),p=transformPoint(probe),tip=transformPoint([t.x,probe[1],centre[2]]);
   const floor=edges.filter(e=>e.lo<tip[1]&&e.hi>tip[1]).sort((a,b)=>Math.abs(a.x-tip[0])-Math.abs(b.x-tip[0]))[0];
   const edge=positive?rb.lo[0]:rb.hi[0];
   const socketBounds=[[Math.min(floor.x,edge),floor.lo,rb.lo[2]],[Math.max(floor.x,edge),floor.hi,rb.hi[2]]];
   return {centre_in_receiver_mm:c,socket_bounds_mm:socketBounds,centre_inside_socket_bounds:c.every((v,i)=>v>=socketBounds[0][i]&&v<=socketBounds[1][i]),tab_material_probe_mm:p,inside_tab:inside(f,...probe),inside_receiver_material:inside(receiver,...c)||inside(receiver,...p),tab_tip_to_notch_floor_mm:Math.abs(tip[0]-floor.x)};
  });
  const nd=new THREE.Vector3(...normal(donor)).transformDirection(di.matrix),nr=new THREE.Vector3(...normal(receiver)).transformDirection(ri.matrix);
  const angle=THREE.MathUtils.radToDeg(nd.angleTo(nr));
  const signedTurn=THREE.MathUtils.radToDeg(Math.atan2(nr.x*nd.z-nr.z*nd.x,nd.dot(nr)));
  const axisError=new THREE.Vector3(...j.donorAxis).applyMatrix4(di.matrix).distanceTo(new THREE.Vector3(...j.flapAxis).applyMatrix4(fi.matrix));
  const depth=Math.max(...[fb.lo[2],fb.hi[2]].map((z,i)=>Math.abs(transformPoint([tips[0].x,tips[0].lo,z])[2]-[rb.lo[2],rb.hi[2]][i])));
  const root=transformPoint(j.flapAxis);const edge=positive?rb.lo[0]:rb.hi[0];
  const record={flap:j.flapKey,donor:j.donorKey,receiver:j.receiverKey,hinge_donor_mm:j.donorAxis,tabs,gap_mm:Math.abs(root[0]-edge),back_depth_error_mm:depth,hinge_axis_error_mm:axisError,angle_deg:angle,signed_turn_deg:signedTurn,flap_positive:positive};
  return record;
}
function passes(r,layout) {
 const expected=layout==='concave'?(r.flap_positive?-45:45):layout==='convex'?(r.flap_positive?45:-45):null;
 return (expected===null||Math.abs(r.signed_turn_deg-expected)<.01)&&r.tabs.every(t=>t.centre_inside_socket_bounds&&t.inside_tab&&!t.inside_receiver_material&&t.tab_tip_to_notch_floor_mm<.02)
   &&r.back_depth_error_mm<.02&&r.hinge_axis_error_mm<1e-5&&Math.abs(r.angle_deg-(layout==='straight'?0:45))<.01;
}
const tests=[], scenes={}, negative={}, leafChecks=[];
const counts=side=>kit.chain?.sides[side]?Array.from({length:kit.chain.max_extra+1},(_,i)=>i):[0];
const leftCounts=counts('left'),rightCounts=counts('right');
const cases=leftCounts.flatMap(left=>rightCounts.map(right=>[left,right]));
for(const [leftCount,rightCount] of cases)for(const layout of kit.layouts){
 const instances=partInstances(kit,{kitId:kit.id,layout:layout.id,extras:kit.extras.filter(e=>e.default_on).map(e=>e.id),doors:'closed',wings:{left:leftCount,right:rightCount},theme:{},palette:[]});
 const byKey=new Map(instances.map(i=>[i.key,i]));
 const name=`${leftCount===0&&rightCount===0?'base':leftCount===leftCounts.at(-1)&&rightCount===rightCounts.at(-1)?'extras':`panels-${leftCount}-${rightCount}`}-${layout.id}`;
 scenes[name]=instances.map(i=>({key:i.key,part:i.part.id,matrix:i.matrix.toArray()}));
 const joints=kit.joints.map(j=>({...j,donorKey:j.donor,receiverKey:j.receiver,flapKey:j.flap,donorAxis:j.hinge_mm,flapAxis:j.hinge_mm}));
 for(const side of ['left','right']){
  const c=kit.chain?.sides[side];if(!c)continue;
  const j=kit.joints.find(j=>c.part_ids.includes(j.flap)||c.inner_part_ids.includes(j.flap));
  for(let k=1;k<=(side==='left'?leftCount:rightCount);k++){
   const outer=id=>`${id}#${side}${k}`,inner=id=>k===1?id:`${id}#${side}${k-1}`;
   const receiverMoves=c.part_ids.includes(j.receiver);
   const shifted=j.hinge_mm.map((v,i)=>v+(i===0?c.step_x_mm:0));
   joints.push({...j,donorKey:receiverMoves?inner(j.receiver):outer(j.donor),receiverKey:receiverMoves?outer(j.receiver):inner(j.donor),flapKey:outer(j.flap),donorAxis:receiverMoves?shifted:j.hinge_mm,flapAxis:j.hinge_mm});
  }
 }
 const checked=[];
 for(const j of joints){
  const record=inspectJoint(j,byKey);
  if(!passes(record,layout.id)){
   await fs.writeFile(path.join(out,'cache','render-data.json'),JSON.stringify({kit_sha256:kitHash,parts:renderParts,scenes}));
   throw Error(`${name}: ${JSON.stringify(record)}`);
  }
  checked.push(record);
 }
 if(layout.id==='concertina'){
  const flat=new Map(partInstances(kit,{kitId:kit.id,layout:'straight',extras:kit.extras.filter(e=>e.default_on).map(e=>e.id),doors:'closed',wings:{left:leftCount,right:rightCount},theme:{},palette:[]}).map(i=>[i.key,i]));
  const along=checked.map(j=>{const f=flat.get(j.flap),b=bounds(geometry.get(f.part.id));return {x:new THREE.Vector3((b.lo[0]+b.hi[0])/2,0,0).applyMatrix4(f.matrix).x,turn:j.signed_turn_deg*(j.flap_positive?1:-1)};}).sort((a,b)=>a.x-b.x);
  if(along.some((j,i)=>i&&Math.abs(j.turn+along[i-1].turn)>.01))throw Error('Concertina does not alternate');
 }
 if(name==='base-straight'){
  const j=joints[0],bad=new Map(byKey),receiver=byKey.get(j.receiverKey),f=bounds(geometry.get(byKey.get(j.flapKey).part.id));
  const delta=design==='birthday'?21.6-checked[0].gap_mm:4;
  const sign=(f.lo[0]+f.hi[0])/2>j.hinge_mm[0]?1:-1;
  bad.set(receiver.key,{...receiver,matrix:receiver.matrix.clone().premultiply(new THREE.Matrix4().makeTranslation(sign*delta,0,0))});
  const witness=inspectJoint(j,bad);
  negative.shifted_receiver={rejected:!passes(witness,layout.id),gap_mm:witness.gap_mm,tip_error_mm:witness.tabs[0].tab_tip_to_notch_floor_mm};
  if(!negative.shifted_receiver.rejected)throw Error('Unseated known negative was accepted');
 }
 if(name==='extras-concave'){
  const [side,c]=Object.entries(kit.chain.sides).find(([,c])=>c.part_ids.some(id=>partMap.get(id).kind==='flap'));
  const flapId=c.part_ids.find(id=>partMap.get(id).kind==='flap'),j=joints.find(j=>j.flapKey===`${flapId}#${side}1`);
  const base=byKey.get(j.donorKey).matrix,hinge=new THREE.Vector3(...c.hinge_mm);
  const wrong=base.clone().multiply(new THREE.Matrix4().makeTranslation(hinge))
    .multiply(new THREE.Matrix4().makeRotationY(THREE.MathUtils.degToRad(c.joints.concave.angle_deg)))
    .multiply(new THREE.Matrix4().makeTranslation(hinge.clone().negate()))
    .multiply(new THREE.Matrix4().makeTranslation(c.step_x_mm,0,0));
  const bad=new Map(byKey);
  for(const key of [j.receiverKey,j.flapKey])bad.set(key,{...byKey.get(key),matrix:wrong});
  const witness=inspectJoint(j,bad);
  negative.previous_joint_pivot={rejected:!passes(witness,layout.id),hinge_separation_mm:witness.hinge_axis_error_mm};
  if(!negative.previous_joint_pivot.rejected)throw Error('Wrong-pivot known negative was accepted');
 }
 if(leftCount===0&&rightCount===0){
  const opened=partInstances(kit,{kitId:kit.id,layout:layout.id,extras:kit.extras.filter(e=>e.default_on).map(e=>e.id),doors:'open',wings:{left:0,right:0},theme:{},palette:[]});
  for(const instance of opened.filter(i=>i.part.kind==='leaf')){
   const closed=byKey.get(instance.key),hinge=new THREE.Vector3(...instance.part.hinge.origin);
   const error=hinge.clone().applyMatrix4(instance.matrix).distanceTo(hinge.clone().applyMatrix4(closed.matrix));
   const turn=new THREE.Quaternion().setFromRotationMatrix(closed.matrix.clone().invert().multiply(instance.matrix)).angleTo(new THREE.Quaternion())*180/Math.PI;
   if(error>1e-6||Math.abs(turn-Math.abs(instance.part.hinge.open_deg))>.01)throw Error(`Leaf hinge failed: ${instance.key}`);
   leafChecks.push({layout:layout.id,leaf:instance.key,angle_deg:turn,hinge_error_mm:error});
  }
 }
 tests.push({case:name,instances:instances.length,joints:checked});
}
await fs.writeFile(path.join(out,'mesh-check.json'),JSON.stringify({design,kit_sha256:kitHash,assets,pose_code_sha256:hash(await fs.readFile(path.join(repo,'src/lib/configurator/assembly.ts'))),tests,negative,leaf_checks:leafChecks},null,2));
await fs.writeFile(path.join(out,'cache','render-data.json'),JSON.stringify({kit_sha256:kitHash,parts:renderParts,scenes}));
await fs.copyFile(path.join(dir,'kit.json'),path.join(out,'kit.json'));
console.log(`${design}: ${tests.length} configurations, ${tests.reduce((n,t)=>n+t.joints.length,0)} joint poses, ${leafChecks.length} leaf poses passed; known negatives rejected`);
