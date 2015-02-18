// Basic framework for clickable menu system
//
// Create text with create_text(r,g,b,a,f,t,x,y,m)
//	r: red (0-255)
//  g: green (0-255)
//  b: blue (0-255)
//  a: alpha (0-1)
//  f: font ("XXpx Font")
//  t: text ("What you want to show")
//  x: x coordinate (left side)
//  y: y coordinate (bottom left corner)
//  m: max width (leave blank for no max)
//
//
// Create images with create_image(image,x,y,w,h)
//  image: created image variable (either from img = document.getElementById('img')  or  img = new Image(); img.src = 'xxx')
//  x: x coordinate (from left side)
//  y: y coordinate (from top)
//  w: desired width (image will stretch/shrink. leave blank for none)
//  h: desired height (image will stretch/shrink. leave blanke for none)
//
//
// 
//
//
//
//
//
//
//
function create_text(r,g,b,a,f,t,x,y,m){
	text_list.push([r,g,b,a,f,t,x,y,m])
}

function create_menu(x,y,w,h,r,g,b,a,f){
	menu_list.push([x,y,w,h,r,g,b,a,f])
}

function draw_menu(){
	for (var i=0;i<menu_list.length;i++){
		ctx.fillStyle='rgba('+menu_list[i][4]+','+menu_list[i][5]+','+menu_list[i][6]+','+menu_list[i][7]+')'
		ctx.fillRect(menu_list[i][0],menu_list[i][1],menu_list[i][2],menu_list[i][3])
	}
}

function draw_text(){
	for (var i=0;i<text_list.length;i++){
		ctx.fillStyle='rgba('+text_list[i][0]+','+text_list[i][1]+','+text_list[i][2]+','+text_list[i][3]+')'
		ctx.font=text_list[i][4]
		if(text_list[i][8]){
			ctx.fillText(text_list[i][5],text_list[i][6],text_list[i][7],text_list[i][8])
		}
		else{ctx.fillText(text_list[i][5],text_list[i][6],text_list[i][7])}
	}
}

function create_image(image,x,y,w,h){
	image_list.push([image,x,y,w,h])
}

function draw_image(){
	for(var i=0;i<image_list.length;i++){
		if(image_list[i][4]){
			ctx.drawImage(image_list[i][0],image_list[i][1],image_list[i][2],image_list[i][3],image_list[i][4])
		}
		else{ctx.drawImage(image_list[i][0],image_list[i][1],image_list[i][2])}
	}
}

document.addEventListener('click',detect_click,false)
function detect_click(e){
	for(var i=0;i<menu_list.length;i++){
		var menu_x = menu_list[i][0]
		var menu_y = menu_list[i][1]
		var menu_w = menu_list[i][2]
		var menu_h = menu_list[i][3]
		if(e.clientX > menu_x &&
		   e.clientX < menu_x + menu_w &&
		   e.clientY > menu_y &&
		   e.clientY < menu_y + menu_h){
			if(menu_list[i][8]){
				menu_list[i][8]()
			}
		}
	}
}