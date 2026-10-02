"""Check each exact joint against its donor and receiver plies in each pose.

This is a bounded static contact check. Local self-contact in a 2 mm flexible
hinge shown as rigid pieces follows the Raffles assembly check's stated scope.
"""
from pathlib import Path
import sys,json
import numpy as np
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'src'))
from screenery.material import mesh_solid,surface_depth_certificate
D=ROOT/'configurator/research/joints'/sys.argv[1]
geometry=json.loads((D/'cache/source-geometry.json').read_text())
scenes=json.loads((D/'cache/render-data.json').read_text())['scenes']
checks=json.loads((D/'mesh-check.json').read_text())
solids={};rows={}
for pid,plies in geometry.items():
    for r in plies:
        key=(pid,r['id']);rows[key]=r
        if 'flap' in pid or any(j['donor'].split('#')[0] in pid or j['receiver'].split('#')[0] in pid for t in checks['tests'] for j in t['joints']):
            solids[key]=mesh_solid(r['vertices_mm'],r['triangles'])
contacts=[];failures=[];tested=0
for test in checks['tests']:
    if not test['case'].startswith(('base-','extras-')):continue
    instances={i['key']:i for i in scenes[test['case']]}
    for joint in test['joints']:
        flap=instances[joint['flap']];fm=np.array(flap['matrix']).reshape(4,4).T
        flap_solid=solids[(flap['part'],geometry[flap['part']][0]['id'])]
        for which in ['donor','receiver']:
            instance=instances[joint[which]];m=np.array(instance['matrix']).reshape(4,4).T
            # Work in the mate's frame. World-space transforms of coplanar
            # faces create tiny slivers that make repeated Boolean probes stall.
            relative=np.linalg.inv(m)@fm
            for exact in [-1.,0.,1.]:
                relative[np.abs(relative-exact)<1e-12]=exact
            fs=flap_solid.transform(relative[:3].tolist())
            for row in geometry[instance['part']]:
                other=solids[(instance['part'],row['id'])];tested+=1
                a=np.array(fs.bounding_box()).reshape(2,3);b=np.array(other.bounding_box()).reshape(2,3)
                if np.any(a[1]<=b[0])or np.any(b[1]<=a[0]):continue
                overlap=fs^other
                if overlap.is_empty():continue
                certificate=surface_depth_certificate(fs,other,.1)
                record={'case':test['case'],'flap':joint['flap'],'mate':joint[which],'ply':row['id'],'volume_mm3':overlap.volume(),'classification':certificate['classification']}
                if certificate['classification']!='below_threshold':
                    box=np.array(overlap.bounding_box()).reshape(2,3)-joint['hinge_donor_mm']
                    if which=='donor' and np.max(abs(box[:,0]))<1.1 and np.max(abs(box[:,2]))<2.1:
                        record.update(classification='rigid_flexible_hinge_skin',bounds_from_axis_mm=box.tolist())
                    else:
                        record['bounds_from_axis_mm']=box.tolist();failures.append(record)
                contacts.append(record)
result={'design':sys.argv[1],'tested_pairs':tested,'contacts':contacts,'failures':failures,'scope':'Exact pre-compression solids with viewer relative transforms in each mate frame; matrix residues within 1e-12 of 0/+1/-1 snapped to those exact values. Delivered GLB seating is checked separately. 0.1 mm contact tolerance; rigid hinge-skin self-contact separately bounded using the Raffles rule. No continuous-motion or manufacturing certification.'}
(D/'contact-check.json').write_text(json.dumps(result,indent=2))
print(sys.argv[1],tested,'pairs;',len(contacts),'contacts;',len(failures),'failures',flush=True)
assert not failures,json.dumps(failures,indent=2)
