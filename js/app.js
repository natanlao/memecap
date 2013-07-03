var active_meme,color1=$('input[name=color1]'),color2=$('input[name=color2]'),font='Impact',font_size=$("#font-size"),line1=$('#text-top'),line2=$('#text-bottom'),outline_size=$("#outline-size"),padding_x=$('#padding-x'),padding_y=$('#padding-y'),canvas=$('#cvs')[0],meme_list_container=$('#meme-list-container'),generate_button=$('#generate'),userlink=$('#img-directlink'),hotlink=$('#img-directlink'),page_link=$('#img-imgurlink'),reddit_link=$('#img-submitreddit'),delete_link=$('#img-delete'),alert_row=$('#alert-row'),loading_bar=$('#loading-bar');client_id='e8016e23a895cb9',ctx=canvas.getContext('2d'),PATH='memes/',img=$("<img />")[0],img_is_loaded=false;function set_generate_button_state(a){switch(a){case 'loading':generate_button.button('loading');generate_button.addClass('btn-progress');break;case 'reset':generate_button.button('reset');generate_button.removeClass('btn-progress');break;}}function set_loading_bar_state(a){switch(a){case 'show':loading_bar.show();break;case 'hide':loading_bar.hide();break;}}function display_alert(a,b,c){$('#alert-triggered').alert('close');var d=' <div class="alert alert-'+a+' fade in out" id="alert-triggered"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>'+b+'</strong> '+c+'</div>';alert_row.append(d);}function fragmentText(a,b){var c=a.split(' '),d=[],e="";if(ctx.measureText(a).width<b)return [a];while(c.length>0){while(ctx.measureText(c[0]).width>=b){var f=c[0];c[0]=f.slice(0,-1);if(c.length>1)c[1]=f.slice(-1)+c[1];else c.push(f.slice(-1));}if(ctx.measureText(e+c[0]).width<b)e+=c.shift()+" ";else{d.push(e);e="";}if(c.length===0)d.push(e);}return d;}function draw(){if(img_is_loaded){var a=640,b=480,c=img.height,d=img.width,e=line1.val(),f=line2.val(),g=parseInt(font_size.val(),0),h=parseInt(padding_y.val(),0),i=parseInt(padding_x.val(),0);while(c>a||d>b){--c;--d;}canvas.height=c;canvas.width=d;ctx.save();ctx.clearRect(0,0,d,c);ctx.drawImage(img,0,0,d,c);ctx.font="bold "+g+"px "+font;ctx.textAlign="center";ctx.fillStyle=color1.val();top_lines=fragmentText(e,d-g-i);bottom_lines=(fragmentText(f,d-g-i)).reverse();top_lines.forEach(function(a,b){ctx.fillText(a,d/2,h+((b+1)*g));});bottom_lines.forEach(function(a,b){ctx.fillText(a,d/2,c-(h+(b*g)));});if(outline_size.val()>0){ctx.strokeStyle=color2.val();ctx.lineWidth=outline_size.val();top_lines.forEach(function(a,b){ctx.strokeText(a,d/2,h+((b+1)*g));});bottom_lines.forEach(function(a,b){ctx.strokeText(a,d/2,c-(h+(b*g)));});}ctx.restore();}else setTimeout(draw,100);}function swap_active_meme(a){set_loading_bar_state('show');active_meme=$(this).find('option:selected').data('img');img_is_loaded=false;img.src=PATH+active_meme;draw();}function image_uploaded(a){hotlink.val(a.data.link);page_link.val('http://imgur.com/'+a.data.id);reddit_link.attr('href','http://www.reddit.com/submit?url='+escape(a.data.link));delete_link.attr('href','http://imgur.com/delete/'+a.data.deletehash);$('#upload-success').modal('show');hotlink[0].select();hotlink[0].focus();set_generate_button_state('reset');}function image_upload_failed(){display_alert('error',"Huh, that's odd.","Memecap couldn't contact Imgur's servers. Try again in a few minutes?");set_generate_button_state('reset');}function generate_meme(a){set_generate_button_state('loading');var b=canvas.toDataURL("image/png").split(',')[1];$.ajax({url:'https://api.imgur.com/3/image',type:'POST',data:{type:'base64',image:b},dataType:'json',headers:{'Authorization':'Client-ID '+client_id}}).success(image_uploaded).error(image_upload_failed);a.preventDefault();return false;}function filter_list(a){if(typeof a!='undefined'&&a.length>0){meme_list_container.find('li:not(.nav-header)').each(function(b,c){if($(this).text().toLowerCase().indexOf(a.toLowerCase())===-1)$(this).hide();else if($(this).is(':hidden'))$(this).show();});}else meme_list_container.find('li:not(.nav-header)').show();}function register_events(){meme_list_container.on('change reset',swap_active_meme);$('#meme-settings :input[type=text]').on('input reset',draw);generate_button.on('click',generate_meme);$('#form-reset').on('click',function(a){$('#meme-settings')[0].reset();swap_active_meme.call(meme_list_container);set_loading_bar_state('hide');});$('form').on('submit',function(a){a.preventDefault();});$('.modal').modal({show:false});meme_list_container.select2();generate_button.button();$('input[type=color]').spectrum({clickoutFiresChange:true,showButtons:false,showInput:true,change:function(a){draw();}});$(document).on('dragover',function(a){a.preventDefault();return false;});$(document).on('drop',function(a){var b=a.dataTransfer||a.originalEvent.dataTransfer;if(b.files.length===1){img_is_loaded=false;set_loading_bar_state('show');var c=b.files[0];if(c.type.indexOf('image')===-1){display_alert('error','Not an image!','You may only drop images on the page.');a.preventDefault();return false;}var d=new FileReader();d.readAsDataURL(c);d.onload=function(a){img_is_loaded=false;img.src=a.target.result;draw();};}else display_alert('error','Too many files!','You can only drop one image on the page at a time.');a.preventDefault();return false;});}function init(){register_events();active_meme=meme_list_container.find('option[selected]').data('img');img_is_loaded=false;img.src=PATH+active_meme;img.onload=function(a){img_is_loaded=true;set_loading_bar_state('hide');};setTimeout(draw,200);}init();