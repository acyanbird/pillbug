import{G as H,W as j,S as D,P as R,C as O,a as U,V,T as q,R as z,b as N,M as b,D as Q,c as f,A as J,d as v,m as K,B as k,e as C,g as X,l as Y,f as Z,h as _,i as $,j as ee,k as te}from"./getpoint-NrRcXqx2.js";const ne=""+new URL("gm-r8CDxIfQ.jpg",import.meta.url).href;let u,oe=new H,a,B=.16,p={},l,A,d,n,s,E,F,m=3,g=0,y=!1,o,I=[],i,T=[],x=window.innerWidth,L=window.innerHeight,M=window.innerWidth/window.innerHeight;function ie(){E=document.getElementById("gl-canvas"),s=new j({canvas:E,antialias:!0}),l=P(3),A=P(5),d=l,n=new D,s.setSize(x,L),s.shadowMap.enabled=!0,s.shadowMap.type=R,s.setClearColor(new O("skyblue")),se(),we(),pe(),S("red",-50,2),S("cyan",-20,1),S("yellow",-10,.5),le(),ae(),s.render(n,d),window.addEventListener("click",function(){re()}),W(),window.addEventListener("resize",de),window.addEventListener("keydown",function(e){p[e.key]=!0}),window.addEventListener("keyup",function(e){p[e.key]=!1})}ie();function re(){d===l?d=A:d=l,s.render(n,d)}function P(e){let t=new U(75,M,.1,1e3);return t.position.y=e,t.lookAt(new V(0,0,-10)),t}function ae(){let e=new q().load(ne);e.wrapS=z,e.wrapT=z,e.repeat.set(1,12);let t=new N(10,120,1,12),c=new b({map:e,side:Q}),w=new f(t,c);w.position.set(0,0,-60),w.rotation.x=Math.PI/2,w.receiveShadow=!0,n.add(w)}function se(){F=new J(16777215,.8),n.add(F);const e=new v(16777215,.8);e.position.set(0,3,20),e.castShadow=!0,n.add(e);const t=new v("orange",1);t.position.set(0,20,-20),t.castShadow=!0,n.add(t)}function de(){x=window.innerWidth,L=window.innerHeight,M=window.innerWidth/window.innerHeight,l.aspect=M,l.updateProjectionMatrix(),s.setSize(x,L),s.render(n,l)}function le(){oe.load(K,function(e){a=e.scene,a.scale.set(.3,.3,.3),a.position.set(0,.2,-3),e.scene.traverse(function(t){t.isMesh&&(t.castShadow=!0)}),n.add(a),u=new k().setFromObject(a)},void 0,function(e){console.error(e)})}function W(){y||(a&&u.setFromObject(a),T.forEach(e=>{e.position.z+=B,e.visible=e.position.z<0&&e.position.z>-100,e.position.z>0&&(e.position.x=r(-4,4),e.position.z+=r(-110,-60)),e.rotation.x+=.01,e.rotation.y+=.01;let t=new C(e.position,.18);u&&u.intersectsSphere(t)&&(e.position.x=r(-4,4),e.position.z+=r(-110,-60),g+=1,document.getElementById("score").innerHTML="Score: "+g,new Audio(X).play())}),I.forEach(e=>{e.position.z+=B,e.visible=e.position.z<0&&e.position.z>-100,e.position.z>0&&(e.position.x=r(-4,4),e.position.z+=r(-140,-60)),e.rotation.x+=.01,e.rotation.y+=.01;let t=new C(e.position,.35);u&&u.intersectsSphere(t)&&(e.position.x=r(-4,4),e.position.z+=r(-140,-60),m-=1,document.getElementById("life").innerHTML="Life: "+m,m!==0?new Audio(Y).play():(new Audio(Z).play(),y=!0,document.getElementById("finalScore").innerHTML="Final Score: "+g,document.getElementById("end").style.display="block"))}),p.ArrowLeft&&a.position.x>-3.5&&(a.position.x-=.05),p.ArrowRight&&a.position.x<3.5&&(a.position.x+=.05),s.render(n,d),y||requestAnimationFrame(W))}function r(e,t){return Math.random()*(t-e)+e}function ce(){let e=new $(.4),t=new b({color:16761035,transparent:!0,opacity:.9});return o=new f(e,t),o.castShadow=!0,o.receiveShadow=!0,o.rotation.x=Math.PI/4,o.rotation.y=Math.PI/4,n.add(o),o}function we(){for(let e=0;e<5;e+=1)o=ce(),o.position.set(r(-4,4),.5,r(-140,-60)),I.push(o),n.add(o),o.boundingBox=new k().setFromObject(o)}function ue(){let e=new ee(.2,32,32),t=new te({color:16766720,metalness:.8,roughness:.5});return i=new f(e,t),i.castShadow=!0,i.receiveShadow=!0,n.add(i),i.geometry.computeBoundingSphere(),i.boundingSphere=i.geometry.boundingSphere,i}function pe(){for(let e=0;e<15;e+=1)i=ue(),i.position.set(r(-4,4),.5,r(-140,-60)),T.push(i),n.add(i)}function S(e,t,c){let w=new _(7,c,16,100),G=new b({color:e}),h=new f(w,G);h.castShadow=!0,h.position.set(0,0,t),n.add(h)}
