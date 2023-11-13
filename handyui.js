(function (window, document, undefined){

"use strict";
   var SwitchButton=function(element,opt){
   		this.element=element;
   		this.defaults = {
       		state:false,
       		flag:'',//当有多条数据时，可以用来区分唯一值
       		
       		change:function(state,flag){}
      },
   		this.options=Object.assign({}, this.defaults, opt);
   		this.init();
   }

   SwitchButton.prototype = {

   		init:function(){
   			this.create();
   			this.bindClick();
   		},
   		
   		create:function(){

   			let html=`<div class="switch-slider"></div>`;

			const switchButton=document.querySelector(this.element);
			if(switchButton===null){
				console.log('The element does not exist');
				return false;
			}
			if(this.options.state){
				html=`<div class="switch-slider switch-on"></div>`;
				switchButton.classList.add("switch-button-container","switch-on");
			}else{
				html=`<div class="switch-slider switch-off"></div>`;
				switchButton.classList.add("switch-button-container","switch-off");
			}
			

			switchButton.innerHTML=html;

   		},
   		bindClick:function(){
   			let that=this;
   			const switchButton=document.querySelector(this.element);
   			switchButton.addEventListener('click',function(){
	  		let classList=switchButton.classList;

	  		const slider=switchButton.children[0];
 			

	  		if(classList.contains('switch-off')){
	  			slider.classList.remove('switch-slider-off');
	  			slider.classList.add('switch-slider-on');

	  			slider.addEventListener("animationstart",function(e){
	  				switchButton.classList.remove('switch-container-fade-out');
				    switchButton.classList.add('switch-container-fade-in');
				});
				slider.addEventListener("animationend", function(event) {				
					// 在动画结束后执行逻辑
					switchButton.classList.remove('switch-off');
					switchButton.classList.add('switch-on');
					

				});
	  				that.options.change(true,that.options.flag);
				}else{		
						slider.classList.remove('switch-slider-on');
			  			slider.classList.add('switch-slider-off');

					slider.addEventListener("animationstart",function(e){
							switchButton.classList.remove('switch-container-fade-in');
						    switchButton.classList.add('switch-container-fade-out');
						});
					slider.addEventListener("animationend", function(event) {
							// 在动画结束后执行逻辑
							switchButton.classList.remove('switch-on');
							switchButton.classList.add('switch-off');
							
						});
						that.options.change(false,that.options.flag);
					}
					
			  });


   		},
   		getCurrentPosition:function(){
   			return this.options.activate;
   		}



   }

var TabHost=function(element,opt){
   		this.element=element;
   		this.defaults = {
       
       		flag:'',//当有多条数据时，可以用来区分唯一值
       		activate:0,
       		data:[],
       		change:function(activate,flag){}
      },
   		this.options=Object.assign({}, this.defaults, opt);
   		this.init();
   }
TabHost.prototype = {
	init:function () {
		this.create();
		this.bindClick();
	},
	create:function(){
		let items='';
		for (var i =0; i<this.options.data.length; i++) {
			items+='<div class="tab-item">'+this.options.data[i]+'</div>'
		};
		let html=`
			<div class="tab-container">
				${items}
			</div>
			<div class="tab-line-container">
				<div class="tab-line"></div>
			</div>`;
			const tabHost=document.querySelector(this.element);
			tabHost.innerHTML=html;
			let width=tabHost.offsetWidth;

			const tabLine=tabHost.children[1].getElementsByClassName('tab-line')[0];
			let percentage=1/this.options.data.length*100+'%';
			tabLine.style.width=percentage;
			let v=this.options.activate*100;
			let marginLeft=(Math.abs(this.options.activate)*(width/this.options.data.length))+'px';
			tabLine.style.marginLeft=marginLeft;

			const tabItem=tabHost.children[0].getElementsByClassName('tab-item')[this.options.activate];
			tabItem.classList.add('tab-item-activate');

	},
	bindClick:function(){
		const tabHost=document.querySelector(this.element);
		const tabItems=tabHost.children[0].getElementsByClassName('tab-item');
		const tabLine=tabHost.children[1].getElementsByClassName('tab-line')[0];
		let width=tabHost.offsetWidth;
		let that=this;
		let length=tabItems.length,index=0,value=0;
		
		for (var i =0;i<tabItems.length; i++) {
			
			tabItems[i].index=i;
			
			tabItems[i].onclick=function(){
				if(this.index!=that.options.activate){

					value=this.index-that.options.activate;
					let v=value*100;
					document.documentElement.style.setProperty('--tabLineOffset', v+'%');		
	  				tabLine.classList.add('tab-line-activate');
	  				for(var k=0;k<tabItems.length;k++){
	  					let tabItem=tabItems[k];
	  					tabItem.classList.remove('tab-item-activate');
	  				}
	  				
	  				this.classList.add('tab-item-activate');

	  				index=this.index;
	  				that.options.change(index);
				}
	  			
			}
		}

		tabLine.addEventListener("animationend", function(event) {
	  			
	  				document.documentElement.style.setProperty('--tabLineCurrentOffset', value+'%');
	  				let marginLeft=(Math.abs(index)*(width/length))+'px';
	  				tabLine.style.marginLeft=marginLeft;
	  				
					that.options.activate=index;
					tabLine.classList.remove('tab-line-activate');
					
						
	  			});

	}


}


var AlertDialog=function(opt){

		this.CONTENT_TEXT=1;
      	this.CONTENT_INPUT=2;
   		this.defaults = {
       
       		flag:'',//当有多条数据时，可以用来区分唯一值
       		data:[],
       		title:'提示框',
       		content:'',
       		cancelButton:true,
       		confirmButton:true,
       		canceled:true,
       		cancelText:'关闭',
       		confirmText:'确定',
       		contentType:this.CONTENT_TEXT,
       		buttons:[],
       		inputNames:[],
       		confirm:function(arges){},
       		cancel:function(){},
       		change:function(activate,flag){}
      },
      	
   		this.options=Object.assign({}, this.defaults, opt);
   		this.init();
   }
AlertDialog.prototype = {
	init:function () {
		this.create();
		this.bindClick();
	},
	create:function(){
		let buttons=this.createButtons();
		
		let title=this.options.title;
		let content=this.options.content;	
		let html=`<div class="dialog-container">
				  <div class="body-container">						    
				      <div class="item-title">${title}</div>
				      <div class="item-content">${content}</div>
				      <div class="item-buttons">
				        ${buttons}
				      </div>
				  </div>
			</div>`;

			var div = document.createElement("div");

			//设置 div 属性，如 id
			let id='dialog_'+getUuid();
			this.id='#'+id;
			div.setAttribute("class", "handyui-dialog");
			div.setAttribute("id",id);

			div.innerHTML = html;
			document.body.appendChild(div);


	},
	createButtons:function(){
		let buttons='';
		if(this.options.cancelButton){
			let cancelText=this.options.cancelText;
			let cancelButton=`<button class="btn btn-close">${cancelText}</button>`;
			buttons=buttons.concat(cancelButton);
		}
		if(this.options.confirmButton){
			let confirmText=this.options.confirmText;
			let confirmButton=`<button class="btn btn-ok">${confirmText}</button>`;
			buttons=buttons.concat(confirmButton);
		}
		return buttons;
	},
	createContent:function(){

		if(this.options.contentType===this.CONTENT_TEXT){

		}else if(this.options.contentType===this.CONTENT_INPUT){

		}
	},
	bindClick:function() {
		const alertDialog=document.querySelector(this.id);
		const btnOk=alertDialog.querySelector('.btn-ok');
		var that=this;

		btnOk?.addEventListener('click',function(){
			if(that.options.contentType===that.CONTENT_TEXT){
				that.hide(alertDialog);
				that.options.confirm();
			}else if(that.options.contentType===that.CONTENT_INPUT){

				alertDialog.style.display='none';
				let arr=[];
				//TODO:如果有自定义输入框时，获得输入框值后再调用remove
				for (var i = 0; i <that.options.inputNames.length; i++) {
					let name=that.options.inputNames[i];
					let input=document.getElementsByName(name)[0];
					let value=input?.value;
					arr.push(value);

				};
				that.options.confirm(arr);
				
			}
			alertDialog.remove();

			
		});

		const btnCancel=alertDialog.querySelector('.btn-close');

		btnCancel?.addEventListener('click',function(){

			that.hide(alertDialog);
			that.options.cancel();
		});

		alertDialog.addEventListener('click',function(){

			if(that.options.canceled){
			       that.hide(alertDialog);
			       that.options.cancel();

			}

			    
		},false);
		const alertBody=alertDialog.querySelector('.body-container');
		alertBody.addEventListener('click',function(){	
			       event.stopPropagation();
			    
		},false);



	},
	hide:function(element){
				element.style.display='none';
				element.remove();
				

	},
	id:''


}






function getUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}









window.SwitchButton=SwitchButton;
window.TabHost=TabHost;
window.AlertDialog=AlertDialog;



})(window, document);
