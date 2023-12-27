import{G as H,W as D,S as R,B as j,C as O,P as V,V as q,T as N,R as b,a as U,M as v,D as J,b as h,A as K,c as z,d as k,e as B,f as Q,g as X,h as Y,i as Z}from"./GLTFLoader-CK7oojKx.js";let u,_=new H,a,C=.15,f={},l,A,d,n,s,E,F,m=3,g=0,y=!1,i,T=[],o,I=[],x=window.innerWidth,L=window.innerHeight,M=window.innerWidth/window.innerHeight;function $(){E=document.getElementById("gl-canvas"),s=new D({canvas:E}),l=P(3),A=P(5),d=l,n=new R,s.setSize(x,L),s.shadowMap.enabled=!0,s.shadowMap.type=j,s.setClearColor(new O("skyblue")),ne(),ae(),de(),S("red",-50,2),S("cyan",-20,1),S("yellow",-10,.5),oe(),te(),s.render(n,d),window.addEventListener("click",function(){ee()}),W(),window.addEventListener("resize",ie),window.addEventListener("keydown",function(e){f[e.key]=!0}),window.addEventListener("keyup",function(e){f[e.key]=!1})}$();function ee(){d===l?d=A:d=l,s.render(n,d)}function P(e){let t=new V(75,M,.1,1e3);return t.position.y=e,t.lookAt(new q(0,0,-10)),t}function te(){let e=new N().load("./assets/grass.png");e.wrapS=b,e.wrapT=b,e.repeat.set(1,12);let t=new U(10,120,5,5),c=new v({map:e,side:J}),w=new h(t,c);w.position.set(0,0,-60),w.rotation.x=Math.PI/2,w.receiveShadow=!0,n.add(w)}function ne(){F=new K(16777215,.8),n.add(F);const e=new z(16777215,.8);e.position.set(0,3,20),e.castShadow=!0,n.add(e);const t=new z("orange",1);t.position.set(0,20,-20),t.castShadow=!0,n.add(t)}function ie(){x=window.innerWidth,L=window.innerHeight,M=window.innerWidth/window.innerHeight,l.aspect=M,l.updateProjectionMatrix(),s.setSize(x,L),s.render(n,l)}function oe(){_.load("./assets/pill.glb",function(e){a=e.scene,a.scale.set(.3,.3,.3),a.position.set(0,.2,-3),e.scene.traverse(function(t){t.isMesh&&(t.castShadow=!0)}),n.add(a),u=new k().setFromObject(a)},void 0,function(e){console.error(e)})}function W(){y||(a&&u.setFromObject(a),I.forEach(e=>{e.position.z+=C,e.visible=e.position.z<0&&e.position.z>-50,e.position.z>0&&(e.position.x=r(-4,4),e.position.z+=r(-110,-60)),e.rotation.x+=.01,e.rotation.y+=.01;let t=new B(e.position,.18);u&&u.intersectsSphere(t)&&(e.position.x=r(-4,4),e.position.z+=r(-110,-60),g+=1,document.getElementById("score").innerHTML="Score: "+g,new Audio("./assets/getpoint.wav").play())}),T.forEach(e=>{e.position.z+=C,e.visible=e.position.z<0&&e.position.z>-60,e.position.z>0&&(e.position.x=r(-4,4),e.position.z+=r(-110,-60)),e.rotation.x+=.01,e.rotation.y+=.01;let t=new B(e.position,.35);u&&u.intersectsSphere(t)&&(e.position.x=r(-4,4),e.position.z+=r(-110,-60),m-=1,document.getElementById("life").innerHTML="Life: "+m,m!==0?new Audio("./assets/loselife.wav").play():(new Audio("./assets/gameover.wav").play(),y=!0,document.getElementById("finalScore").innerHTML="Final Score: "+g,document.getElementById("end").style.display="block"))}),f.ArrowLeft&&a.position.x>-3.5&&(a.position.x-=.05),f.ArrowRight&&a.position.x<3.5&&(a.position.x+=.05),s.render(n,d),y||requestAnimationFrame(W))}function r(e,t){return Math.random()*(t-e)+e}function re(){let e=new X(.4),t=new v({color:16761035,transparent:!0,opacity:.9});return i=new h(e,t),i.castShadow=!0,i.receiveShadow=!0,i.rotation.x=Math.PI/4,i.rotation.y=Math.PI/4,n.add(i),i}function ae(){for(let e=0;e<5;e+=1)i=re(),i.position.set(r(-4,4),.5,r(-120,-80)),T.push(i),n.add(i),i.boundingBox=new k().setFromObject(i)}function se(){let e=new Y(.2,32,32),t=new Z({color:16766720,metalness:.8,roughness:.5});return o=new h(e,t),o.castShadow=!0,o.receiveShadow=!0,n.add(o),o.geometry.computeBoundingSphere(),o.boundingSphere=o.geometry.boundingSphere,o}function de(){for(let e=0;e<15;e+=1)o=se(),o.position.set(r(-4,4),.5,r(-120,-80)),I.push(o),n.add(o)}function S(e,t,c){let w=new Q(7,c,16,100),G=new v({color:e}),p=new h(w,G);return p.castShadow=!0,p.receiveShadow=!0,p.position.set(0,0,t),n.add(p),p}
