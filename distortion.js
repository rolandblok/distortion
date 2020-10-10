function init() {
  disto = new Disto("disto");
  disto.animLoop();
}


class Disto {

  constructor(name) {

      this.name = name;
 
      this.canvas = document.getElementById("canvas");
      this.canvas.addEventListener("mousedown", this, false);
      this.canvas.addEventListener("mouseup", this, false);
      this.canvas.addEventListener("mousemove", this, false);
      this.canvas.addEventListener("click", this, false);
      this.canvas.addEventListener("dblclick", this, false);
      //this.canvas.addEventListener("resize", this, false);

      this.canvas.addEventListener('keydown', this, false);
      this.canvas.addEventListener('keyup', this, false);
      this.canvas.addEventListener('wheel', this, false);
      let me = this // this is the-javascript-shiat!  https://stackoverflow.com/questions/4586490/how-to-reference-a-function-from-javascript-class-method
      window.addEventListener( 'resize', function bla(event) {
                console.log("resize " + me.name)
                me.THREEcamera.aspect = window.innerWidth / window.innerHeight;
                me.THREEcamera.updateProjectionMatrix();
                me.renderer.setSize(window.innerWidth, window.innerHeight);
              }, false );

      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);

      this.rot_speed_x =  0.004;
      this.rot_speed_y =  0.008;

      this.xMx =  0.1;
      this.xMy =  0.;
      this.xMxx =  0.0;
      this.xMxy =  0.0;
      this.xMyy =  0.0;
      this.xMxxx =  0.0;
      this.xMxxy =  0.0;
      this.xMxyy =  0.0;
      this.xMyyy =  0.0;

      this.yMy =  0.1;
      this.yMx =  0.;
      this.yMyy =  0.0;
      this.yMyx =  0.0;
      this.yMxx =  0.0;
      this.yMyyy =  0.0;
      this.yMyyx =  0.0;
      this.yMyxx =  0.001;
      this.yMxxx =  0.0;

      this.gui = new dat.GUI();
      this.gui_dist_x = this.gui.addFolder('disto-x')
      this.gui_dist_x.add(this, "xMx").step(0.1)
      this.gui_dist_x.add(this, "xMy").step(0.1)
      this.gui_dist_x.add(this, "xMxx").step(0.01)
      this.gui_dist_x.add(this, "xMxy").step(0.01)
      this.gui_dist_x.add(this, "xMyy").step(0.01)
      this.gui_dist_x.add(this, "xMxxx").step(0.001)
      this.gui_dist_x.add(this, "xMxxy").step(0.001)
      this.gui_dist_x.add(this, "xMxyy").step(0.001)
      this.gui_dist_x.add(this, "xMyyy").step(0.001)
      this.gui_dist_x.open();
      this.gui_dist_y = this.gui.addFolder('disto-y')
      this.gui_dist_y.add(this, "yMy").step(0.1)
      this.gui_dist_y.add(this, "yMx").step(0.1)
      this.gui_dist_y.add(this, "yMyy").step(0.01)
      this.gui_dist_y.add(this, "yMyx").step(0.01)
      this.gui_dist_y.add(this, "yMxx").step(0.01)
      this.gui_dist_y.add(this, "yMyyy").step(0.001)
      this.gui_dist_y.add(this, "yMyyx").step(0.001)
      this.gui_dist_y.add(this, "yMyxx").step(0.001)
      this.gui_dist_y.add(this, "yMxxx").step(0.001)
      this.gui_dist_y.open();
      

      // THREE / GL
      this.three_scene = new THREE.Scene();

      this.fov = 55
      this.THREEcamera = new THREE.PerspectiveCamera( this.fov, 1.33, 0.01, 2000 );
      
      this.THREEcamera.up = new THREE.Vector3(0,   0,   1)
      this.THREEcamera.aspect = window.innerWidth / window.innerHeight;
      this.THREEcamera.fov = this.fov
      this.THREEcamera.position.set(0, 0, 40)
      this.THREEcamera.lookAt(new THREE.Vector3(0,   0,  0))
      this.THREEcamera.updateProjectionMatrix();
      this.back_color = 0x000000

      this.three_light = new THREE.PointLight( "ffffff", 1, 0 )
      this.three_light.position.set(10, 10, 10)
      
      this.three_scene.add( this.three_light );

      this.raycaster = new THREE.Raycaster(); 


      var line_geom = new THREE.Geometry();
      var line_geom_d = new THREE.Geometry();
      line_geom.verticesNeedUpdate = true;
      line_geom.dynamic = true;
      line_geom_d.dynamic = true;

      let line_material = new THREE.LineBasicMaterial( { color: 0xff0000, linewidth: 2 } );
      let line_material_d = new THREE.LineBasicMaterial( { color: 0xffff00, linewidth: 2 } );

      let material = new THREE.MeshPhongMaterial( {color:"#00ff00"} );
      this.boxes = new Set()
      for (let x = -15; x < 16; x ++) {
        let geometry = new THREE.BoxGeometry(0.5, 0.5 , 0.5);
        let mesh_box = new THREE.Mesh( geometry, material )
        mesh_box.position.x = x
        mesh_box.position.y = 15
        this.boxes.add(mesh_box)
        this.three_scene.add( mesh_box );

        line_geom.vertices.push(new THREE.Vector3(x, 15, 0));
        line_geom_d.vertices.push(new THREE.Vector3(x, 15, 0));
      }

      for (let y = 14; y > -16; y --) {
        let geometry = new THREE.BoxGeometry(0.5, 0.5 , 0.5);
        let mesh_box = new THREE.Mesh( geometry, material )
        mesh_box.position.x = 15
        mesh_box.position.y = y
        this.boxes.add(mesh_box)
        this.three_scene.add( mesh_box );

        line_geom.vertices.push(new THREE.Vector3(15, y, 0));
        line_geom_d.vertices.push(new THREE.Vector3(15, y, 0));
      }

      for (let x = 14; x > -16; x --) {
        let geometry = new THREE.BoxGeometry(0.5, 0.5 ,0.5);
        let mesh_box = new THREE.Mesh( geometry, material )
        mesh_box.position.x = x
        mesh_box.position.y = -15
        this.boxes.add(mesh_box)
        this.three_scene.add( mesh_box );
        
        line_geom.vertices.push(new THREE.Vector3(x, -15, 0));
        line_geom_d.vertices.push(new THREE.Vector3(x, -15, 0));

      }
      for (let y = -14; y < 16; y ++) {
        let geometry = new THREE.BoxGeometry(0.5, 0.5 ,0.5);
        let mesh_box = new THREE.Mesh( geometry, material )
        mesh_box.position.x = -15
        mesh_box.position.y = y
        this.boxes.add(mesh_box)
        this.three_scene.add( mesh_box );
        
        line_geom.vertices.push(new THREE.Vector3(-15, y, 0));
        line_geom_d.vertices.push(new THREE.Vector3(-15, y, 0));
      }

      this.lin = new THREE.Line(line_geom, line_material);
      this.three_scene.add(this.lin)
      this.lin_d = new THREE.Line(line_geom_d, line_material_d);
      this.three_scene.add(this.lin_d)

      this.renderer = new THREE.WebGLRenderer({canvas: this.canvas_g, antialias: true, depth: true});
      this.renderer.setSize( window.innerWidth, window.innerHeight);
      this.canvas = document.body.appendChild(this.renderer.domElement);
      
     
      this.last_update_time = null;

  }

  animLoop(cur_time_ms) {
    var me = this; // https://stackoverflow.com/questions/4586490/how-to-reference-a-function-from-javascript-class-method
    //window.requestAnimationFrame(function (cur_time) { me.drawAndUpdate(cur_time); });

    this.stats.begin();

    //update
    if(this.last_update_time_ms != null){
        var d_time_ms = cur_time_ms - this.last_update_time_ms
    }
    this.last_update_time_ms = cur_time_ms;

    // draw
    window.requestAnimationFrame(function (cur_time) { me.animLoop(cur_time); });
    this.render();

    this.stats.end();

  }

  render() {
    
    for (let mesh_box of this.boxes) {
      mesh_box.rotation.x += this.rot_speed_x;
      mesh_box.rotation.y += this.rot_speed_y;
    }

    for ( var i = 0 ; i < this.lin.geometry.vertices.length; i ++ ) {

      let x = this.lin.geometry.vertices[i].x
      let y = this.lin.geometry.vertices[i].y
      this.lin_d.geometry.vertices[i].x = x + x*this.xMx + y*this.xMy
      this.lin_d.geometry.vertices[i].x += x*x*this.xMxx + x*y*this.xMxy + y*y*this.xMyy
      this.lin_d.geometry.vertices[i].x += x*x*x*this.xMxxx + x*x*y*this.xMxxy + x*y*y*this.xMxyy + y*y*y*this.xMyyy
      
      this.lin_d.geometry.vertices[i].y = y + y*this.yMy + x*this.yMx
      this.lin_d.geometry.vertices[i].y += y*y*this.yMyy + y*x*this.yMyx + x*x*this.yMxx
      this.lin_d.geometry.vertices[i].y += y*y*y*this.yMyyy + y*y*x*this.yMyyx + y*x*x*this.yMyxx + x*x*x*this.yMxxx

      this.lin_d.geometry.verticesNeedUpdate = true;
    }

    this.renderer.render(this.three_scene, this.THREEcamera)

  }
      



  _raycastMouseToTile(e){
    // some raycasting to deterimine the active tile.
    this.mouse_position.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    this.mouse_position.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    this.raycaster.setFromCamera( this.mouse_position, this.camera.THREEcamera);
    var intersects = this.raycaster.intersectObjects( this.three_scene.children );

    return intersects.map(x => x.object.name);
  }


  onmousemove(e) {
    //console.log(" onmousemove : " + e.x + " " + e.y)
    console.log(" onmousemove : ")
  }

  onmousedown(e) {
    console.log(" onmousedown : " + e.x + " " + e.y)
  }
  onmouseup(e) {
    console.log(" onmouseup : " + e.x + " " + e.y)
    // var game_object_ids = this._raycastMouseToTile(e);
  }

  keyDown(e){
    console.log(" keyDown : "+ e.x + " " + e.y)
  }

  keyUp(e){
    console.log(" keyUp : "+ e.x + " " + e.y)
  }

  wheel(e){
      console.log(" w " + e.deltaX + " " + e.deltaY + " " + e.deltaZ + " " + e.deltaMode)
  }

  handleEvent(evt) {
      //console.log("event type " + evt.type)
      switch (evt.type) {
          case "wheel":
              this.wheel(evt);
              break;
          case "keydown":
              this.keyDown(evt)
              break;
          case "mousemove":
              //mouse move also fires at click...
              this.onmousemove(evt);
              break;
          case "mousedown":
              this.onmousedown(evt);
              break;
          case "mouseup":
              this.onmouseup(evt);
              break;
          case "dblclick":
              break;
          case "keydown":
              this.keyDown(evt);
              break;
          case "keyup":
              this.keyUp(evt);
              break;
          default:
              return;
      }
  }


}
