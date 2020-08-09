(function($,undefined){
    $.fn.zyUpload = function(options,param){
        var otherArgs = Array.prototype.slice.call(arguments, 1);
        if (typeof options == 'string') {
            var fn = this[0][options];
            if($.isFunction(fn)){
                return fn.apply(this, otherArgs);
            }else{
                throw ("zyUpload - No such method: " + options);
            }
        }

        return this.each(function(){
            var para = {};    // 淇濈暀鍙傛暟
            var self = this;  // 淇濆瓨缁勪欢瀵硅薄

            var defaults = {
                width            : "700px",  					// 瀹藉害
                height           : "400px",  					// 瀹藉害
                itemWidth        : "140px",                     // 鏂囦欢椤圭殑瀹藉害
                itemHeight       : "120px",                     // 鏂囦欢椤圭殑楂樺害
                url              : "/upload/UploadAction",  	// 涓婁紶鏂囦欢鐨勮矾寰�
                multiple         : true,  						// 鏄惁鍙互澶氫釜鏂囦欢涓婁紶
                dragDrop         : true,  						// 鏄惁鍙互鎷栧姩涓婁紶鏂囦欢
                del              : true,  						// 鏄惁鍙互鍒犻櫎鏂囦欢
                finishDel        : false,  						// 鏄惁鍦ㄤ笂浼犳枃浠跺畬鎴愬悗鍒犻櫎棰勮
                /* 鎻愪緵缁欏閮ㄧ殑鎺ュ彛鏂规硶 */
                onSelect         : function(selectFiles, files){},// 閫夋嫨鏂囦欢鐨勫洖璋冩柟娉�  selectFile:褰撳墠閫変腑鐨勬枃浠�  allFiles:杩樻病涓婁紶鐨勫叏閮ㄦ枃浠�
                onDelete		 : function(file, files){},     // 鍒犻櫎涓€涓枃浠剁殑鍥炶皟鏂规硶 file:褰撳墠鍒犻櫎鐨勬枃浠�  files:鍒犻櫎涔嬪悗鐨勬枃浠�
                onSuccess		 : function(file){},            // 鏂囦欢涓婁紶鎴愬姛鐨勫洖璋冩柟娉�
                onFailure		 : function(file){},            // 鏂囦欢涓婁紶澶辫触鐨勫洖璋冩柟娉�
                onComplete		 : function(responseInfo){},    // 涓婁紶瀹屾垚鐨勫洖璋冩柟娉�
            };

            para = $.extend(defaults,options);

            this.init = function(){
                this.createHtml();  // 鍒涘缓缁勪欢html
                this.createCorePlug();  // 璋冪敤鏍稿績js
            };

            /**
             * 鍔熻兘锛氬垱寤轰笂浼犳墍浣跨敤鐨刪tml
             * 鍙傛暟: 鏃�
             * 杩斿洖: 鏃�
             */
            this.createHtml = function(){
                var multiple = "";  // 璁剧疆澶氶€夌殑鍙傛暟
                para.multiple ? multiple = "multiple" : multiple = "";
                var html= '';

                if(para.dragDrop){
                    // 鍒涘缓甯︽湁鎷栧姩鐨刪tml
                    html += '<form id="uploadForm" action="'+para.url+'" method="post" enctype="multipart/form-data">';
                    html += '	<div class="upload_box">';
                    html += '		<div class="upload_main">';
                    html += '			<div class="upload_choose">';
                    html += '				<div class="convent_choice">';
                    html += '					<div class="andArea">';
                    html += '						<div class="filePicker">点击选择文件</div>';
                    html += '						<input id="fileImage" type="file" size="30" name="fileselect[]" '+multiple+'>';
                    html += '					</div>';
                    html += '				</div>';
                    html += '				<span id="fileDragArea" class="upload_drag_area">或者将文件拖到此处</span>';
                    html += '			</div>';
                    html += '			<div class="status_bar">';
                    // athena hide start 20170228
                    //html += '				<div id="status_info" class="info">閫変腑0寮犳枃浠讹紝鍏�0B銆�</div>';
                    html += '				<div id="status_info" class="info"></div>';
                    // athena hide start 20170228
                    html += '				<div class="btns">';
                    //html += '					<div class="webuploader_pick">继续选择</div>';
                    html += '					<div class="upload_btn">开始上传</div>';
                    html += '				</div>';
                    html += '			</div>';
                    html += '			<div id="preview" class="upload_preview"></div>';
                    html += '		</div>';
                    html += '		<div class="upload_submit">';
                    html += '			<button type="button" id="fileSubmit" class="upload_submit_btn">纭涓婁紶鏂囦欢</button>';
                    html += '		</div>';
                    html += '		<div id="uploadInf" class="upload_inf"></div>';
                    html += '	</div>';
                    html += '</form>';
                }else{
                    var imgWidth = parseInt(para.itemWidth.replace("px", ""))-15;

                    // 鍒涘缓涓嶅甫鏈夋嫋鍔ㄧ殑html
                    html += '<form id="uploadForm" action="'+para.url+'" method="post" enctype="multipart/form-data">';
                    html += '	<div class="upload_box">';
                    html += '		<div class="upload_main single_main">';
                    html += '			<div class="status_bar">';
                    html += '				<div id="status_info" class="info">閫変腑0寮犳枃浠讹紝鍏�0B銆�</div>';
                    html += '				<div class="btns">';
                    html += '					<input id="fileImage" type="file" size="30" name="fileselect[]" '+multiple+'>';
                    html += '					<div class="webuploader_pick">閫夋嫨鏂囦欢</div>';
                    html += '					<div class="upload_btn">开始上传</div>';
                    html += '				</div>';
                    html += '			</div>';
                    html += '			<div id="preview" class="upload_preview">';
                    html += '				<div class="add_upload">';
                    html += '					<a style="height:'+para.itemHeight+';width:'+para.itemWidth+';" title="鐐瑰嚮娣诲姞鏂囦欢" id="rapidAddImg" class="add_imgBox" href="javascript:void(0)">';
                    html += '						<div class="uploadImg" style="width:'+imgWidth+'px">';
                    html += '							<a href="http://www.baidu2.com"><img class="upload_image" src="control/img/add_img.png" style="width:expression(this.width > '+imgWidth+' ? '+imgWidth+'px : this.width)" /></a>';
                    html += '						</div>';
                    html += '					</a>';
                    html += '				</div>';
                    html += '			</div>';
                    html += '		</div>';
                    html += '		<div class="upload_submit">';
                    html += '			<button type="button" id="fileSubmit" class="upload_submit_btn">纭涓婁紶鏂囦欢</button>';
                    html += '		</div>';
                    html += '		<div id="uploadInf" class="upload_inf"></div>';
                    html += '	</div>';
                    html += '</form>';
                }

                $(self).append(html).css({"width":para.width,"height":para.height});

                // 鍒濆鍖杊tml涔嬪悗缁戝畾鎸夐挳鐨勭偣鍑讳簨浠�
                this.addEvent();
            };

            /**
             * 鍔熻兘锛氭樉绀虹粺璁′俊鎭拰缁戝畾缁х画涓婁紶鍜屼笂浼犳寜閽殑鐐瑰嚮浜嬩欢
             * 鍙傛暟: 鏃�
             * 杩斿洖: 鏃�
             */
            this.funSetStatusInfo = function(files){
                var size = 0;
                var num = files.length;
                $.each(files, function(k,v){
                    // 璁＄畻寰楀埌鏂囦欢鎬诲ぇ灏�
                    size += v.size;
                });

                // 杞寲涓簁b鍜孧B鏍煎紡銆傛枃浠剁殑鍚嶅瓧銆佸ぇ灏忋€佺被鍨嬮兘鏄彲浠ョ幇瀹炲嚭鏉ャ€�
                if (size > 1024 * 1024) {
                    size = (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
                } else {
                    size = (Math.round(size * 100 / 1024) / 100).toString() + 'KB';
                }

                // 璁剧疆鍐呭
                // athena hide start 20170228
                //$("#status_info").html("閫変腑"+num+"寮犳枃浠讹紝鍏�"+size+"銆�");
                // athena hide end 20170228
            };

            /**
             * 鍔熻兘锛氳繃婊や笂浼犵殑鏂囦欢鏍煎紡绛�
             * 鍙傛暟: files 鏈閫夋嫨鐨勬枃浠�
             * 杩斿洖: 閫氳繃鐨勬枃浠�
             */
            /* athena add 20170227 start*/
            this.funFilterEligibleFile = function(files){
                var arrFiles = [];  // 鏇挎崲鐨勬枃浠舵暟缁�
                for (var i = 0, file; file = files[i]; i++) {
                    /*if(file.type.indexOf("jpeg")<0 && file.type.indexOf("png")<0){
                        //alert(file.type);
                        alert('鍥剧墖鏍煎紡涓嶅锛屽彧鑳戒笂浼爅pg涓巔ng鐨勫浘鐗�');
                        continue;
                    }*/
                    if (file.size >= 51200000) {
                        alert('鎮ㄨ繖涓�"'+ file.name +'"鏂囦欢澶у皬杩囧ぇ');
                    } else {
                        // 鍦ㄨ繖閲岄渶瑕佸垽鏂綋鍓嶆墍鏈夋枃浠朵腑
                        arrFiles.push(file);
                    }
                }
                return arrFiles;
            };
            /* athena add 20170227 end*/

            /**
             * 鍔熻兘锛� 澶勭悊鍙傛暟鍜屾牸寮忎笂鐨勯瑙坔tml
             * 鍙傛暟: files 鏈閫夋嫨鐨勬枃浠�
             * 杩斿洖: 棰勮鐨刪tml
             */
            this.funDisposePreviewHtml = function(file, e){
                var html = "";
                var imgWidth = parseInt(para.itemWidth.replace("px", ""))-15;

                // 澶勭悊閰嶇疆鍙傛暟鍒犻櫎鎸夐挳
                var delHtml = "";
                if(para.del){  // 鏄剧ず鍒犻櫎鎸夐挳
                    delHtml = '<span class="file_del" data-index="'+file.index+'" title="删除"></span>';
                }

                // 澶勭悊涓嶅悓绫诲瀷鏂囦欢浠ｈ〃鐨勫浘鏍�
                var fileImgSrc = "control/images/fileType/";
                if(file.type.indexOf("rar") > 0){
                    fileImgSrc = fileImgSrc + "rar.png";
                }else if(file.type.indexOf("zip") > 0){
                    fileImgSrc = fileImgSrc + "zip.png";
                }else if(file.type.indexOf("text") > 0){
                    fileImgSrc = fileImgSrc + "txt.png";
                }else{
                    fileImgSrc = fileImgSrc + "file.png";
                }


                // 鍥剧墖涓婁紶鐨勬槸鍥剧墖杩樻槸鍏朵粬绫诲瀷鏂囦欢
                if (file.type.indexOf("image") == 0) {
                    html += '<div id="uploadList_'+ file.index +'" class="upload_append_list">';
                    html += '	<div class="file_bar">';
                    html += '		<div>';
                    html += '			<p class="file_name">' + file.name + '</p>';
                    html += delHtml;   // 鍒犻櫎鎸夐挳鐨刪tml
                    html += '		</div>';
                    html += '	</div>';
                    //athena 20170228 edit start
                    html += '	<a style="width:'+para.itemWidth+';" href="#" class="imgBox">';
                    //html += '	<a style="height:'+para.itemHeight+';width:'+para.itemWidth+';" href="#" class="imgBox">';
                    html += '		<div class="uploadImg">';
                    //html += '		<div class="uploadImg" style="width:'+imgWidth+'px">';
                    //athena 20170228 edit start
                    html += '			<img id="uploadImage_'+file.index+'" class="upload_image" src="' + e.target.result + '" style="width:expression(this.width > '+imgWidth+' ? '+imgWidth+'px : this.width)" />';
                    html += '		</div>';
                    html += '	</a>';

                    //athena add start 0225
                    html += '	<div class="upload_oper_box" id="ddd">';
                    //athena add 20170228 start
                    // 澶勭悊閰嶇疆鍙傛暟閫夋嫨鎸夐挳
                    //html += '	<div class="file_select">';
                    //html += '		<select id="img_type'+file.index+'">';
                    //html += '			<option>--璇烽€夋嫨--</option>';
                    //html += '			<option>鍗敓闂�</option>';
                    //html += '			<option>鍘ㄦ埧</option>';
                    //html += '			<option>瀹ゅ唴</option>';
                    //html += '		</select>';
                    //html += '	</div>';
                    //athena add 20170228 end
                    html += '		<span style="padding-left:15px;padding-right:30px;margin-top:6px;display:inline-block;" onclick="setimgbox('+file.index+')" id="img'+file.index+'">放大</span>&nbsp;';
                    //html += '		<span>缈昏浆</span>&nbsp;';
                    html += '		<span onclick="delimg('+file.index+')" id="delimg'+file.index+'">删除</span>';
                    html += '	</div>';
                    //athena add end 0225
                    //
                    html += '	<p id="uploadProgress_'+file.index+'" class="file_progress"></p>';
                    html += '	<p id="uploadFailure_'+file.index+'" class="file_failure">涓婁紶澶辫触锛岃閲嶈瘯</p>';
                    html += '	<p id="uploadSuccess_'+file.index+'" class="file_success"></p>';
                    html += '</div>';

                }else{
                    html += '<div id="uploadList_'+ file.index +'" class="upload_append_list">';
                    html += '	<div class="file_bar">';
                    html += '		<div style="padding:5px;">';
                    html += '			<p class="file_name">' + file.name + '</p>';
                    html += delHtml;   // 鍒犻櫎鎸夐挳鐨刪tml
                    html += '		</div>';
                    html += '	</div>';
                    html += '	<a style="height:'+para.itemHeight+';width:'+para.itemWidth+';" href="#" class="imgBox">';
                    html += '		<div class="uploadImg" style="width:'+imgWidth+'px">';
                    html += '			<a href="http://www.baidu1.com"><img id="uploadImage_'+file.index+'" class="upload_image" src="' + fileImgSrc + '" style="width:expression(this.width > '+imgWidth+' ? '+imgWidth+'px : this.width)" /></a>';
                    html += '		</div>';
                    html += '	</a>';
                    html += '	<p id="uploadProgress_'+file.index+'" class="file_progress"></p>';
                    html += '	<p id="uploadFailure_'+file.index+'" class="file_failure">涓婁紶澶辫触锛岃閲嶈瘯</p>';
                    html += '	<p id="uploadSuccess_'+file.index+'" class="file_success"></p>';
                    html += '</div>';
                }

                return html;
            };

            /**
             * 鍔熻兘锛氳皟鐢ㄦ牳蹇冩彃浠�
             * 鍙傛暟: 鏃�
             * 杩斿洖: 鏃�
             */
            this.createCorePlug = function(){
                var params = {
                    fileInput: $("#fileImage").get(0),
                    uploadInput: $("#fileSubmit").get(0),
                    dragDrop: $("#fileDragArea").get(0),
                    url: $("#uploadForm").attr("action"),

                    filterFile: function(files) {
                        // 杩囨护鍚堟牸鐨勬枃浠�
                        return self.funFilterEligibleFile(files);
                    },
                    onSelect: function(selectFiles, allFiles) {
                        para.onSelect(selectFiles, allFiles);  // 鍥炶皟鏂规硶
                        self.funSetStatusInfo(ZYFILE.funReturnNeedFiles());  // 鏄剧ず缁熻淇℃伅
                        var html = '', i = 0;
                        // 缁勭粐棰勮html
                        var funDealtPreviewHtml = function() {
                            file = selectFiles[i];
                            if (file) {
                                var reader = new FileReader()
                                reader.onload = function(e) {
                                    // 澶勭悊涓嬮厤缃弬鏁板拰鏍煎紡鐨刪tml
                                    html += self.funDisposePreviewHtml(file, e);

                                    i++;
                                    // 鍐嶆帴鐫€璋冪敤姝ゆ柟娉曢€掑綊缁勬垚鍙互棰勮鐨刪tml
                                    funDealtPreviewHtml();
                                }
                                reader.readAsDataURL(file);
                            } else {
                                // 璧板埌杩欓噷璇存槑鏂囦欢html宸茬粡缁勭粐瀹屾瘯锛岃鎶奾tml娣诲姞鍒伴瑙堝尯
                                funAppendPreviewHtml(html);
                            }
                        };

                        // 娣诲姞棰勮html
                        var funAppendPreviewHtml = function(html){
                            // 娣诲姞鍒版坊鍔犳寜閽墠
                            if(para.dragDrop){
                                $("#preview").append(html);
                            }else{
                                $(".add_upload").before(html);
                            }
                            // 缁戝畾鍒犻櫎鎸夐挳
                            funBindDelEvent();
                            funBindHoverEvent();
                        };

                        // 缁戝畾鍒犻櫎鎸夐挳浜嬩欢
                        var funBindDelEvent = function(){
                            if($(".file_del").length>0){
                                // 鍒犻櫎鏂规硶
                                $(".file_del").click(function() {
                                    ZYFILE.funDeleteFile(parseInt($(this).attr("data-index")), true);
                                    return false;
                                });
                            }

                            if($(".file_edit").length>0){
                                // 缂栬緫鏂规硶
                                $(".file_edit").click(function() {
                                    // 璋冪敤缂栬緫鎿嶄綔
                                    //ZYFILE.funEditFile(parseInt($(this).attr("data-index")), true);
                                    return false;
                                });
                            }
                        };

                        // 缁戝畾鏄剧ず鎿嶄綔鏍忎簨浠�
                        var funBindHoverEvent = function(){
                            $(".upload_append_list").hover(
                                function (e) {
                                    $(this).find(".file_bar").addClass("file_hover");
                                },function (e) {
                                    $(this).find(".file_bar").removeClass("file_hover");
                                }
                            );
                        };

                        funDealtPreviewHtml();
                    },
                    onDelete: function(file, files) {
                        // 绉婚櫎鏁堟灉
                        $("#uploadList_" + file.index).fadeOut();
                        // 閲嶆柊璁剧疆缁熻鏍忎俊鎭�
                        self.funSetStatusInfo(files);
                        console.info("鍓╀笅鐨勬枃浠�");
                        console.info(files);
                    },
                    onProgress: function(file, loaded, total) {
                        var eleProgress = $("#uploadProgress_" + file.index), percent = (loaded / total * 100).toFixed(2) + '%';
                        if(eleProgress.is(":hidden")){
                            eleProgress.show();
                        }
                        eleProgress.css("width",percent);
                    },
                    onSuccess: function(file, response) {
                        $("#uploadProgress_" + file.index).hide();
                        $("#uploadSuccess_" + file.index).show();
                        $("#uploadInf").append("<p>恭喜你,上传成功" + response + "</p>");
                        // 鏍规嵁閰嶇疆鍙傛暟纭畾闅愪笉闅愯棌涓婁紶鎴愬姛鐨勬枃浠�
                        if(para.finishDel){
                            // 绉婚櫎鏁堟灉
                            $("#uploadList_" + file.index).fadeOut();
                            // 閲嶆柊璁剧疆缁熻鏍忎俊鎭�
                            self.funSetStatusInfo(ZYFILE.funReturnNeedFiles());
                        }
                    },
                    onFailure: function(file) {
                        $("#uploadProgress_" + file.index).hide();
                        $("#uploadSuccess_" + file.index).show();
                        $("#uploadInf").append("<p>鏂囦欢" + file.name + "涓婁紶澶辫触锛�</p>");
                        //$("#uploadImage_" + file.index).css("opacity", 0.2);
                    },
                    onComplete: function(response){
                        console.info(response);
                    },
                    onDragOver: function() {
                        $(this).addClass("upload_drag_hover");
                    },
                    onDragLeave: function() {
                        $(this).removeClass("upload_drag_hover");
                    }

                };

                ZYFILE = $.extend(ZYFILE, params);
                ZYFILE.init();
            };

            /**
             * 鍔熻兘锛氱粦瀹氫簨浠�
             * 鍙傛暟: 鏃�
             * 杩斿洖: 鏃�
             */
            this.addEvent = function(){
                // 濡傛灉蹇嵎娣诲姞鏂囦欢鎸夐挳瀛樺湪
                if($(".filePicker").length > 0){
                    // 缁戝畾閫夋嫨浜嬩欢
                    $(".filePicker").bind("click", function(e){
                        $("#fileImage").val('');
                        $("#fileImage").click();
                    });
                }

                // 缁戝畾缁х画娣诲姞鐐瑰嚮浜嬩欢
                $(".webuploader_pick").bind("click", function(e){
                    $("#fileImage").val('');
                    $("#fileImage").click();
                });

                // 缁戝畾涓婁紶鐐瑰嚮浜嬩欢
                $(".upload_btn").bind("click", function(e){
                    // 鍒ゆ柇褰撳墠鏄惁鏈夋枃浠堕渶瑕佷笂浼�
                    if(ZYFILE.funReturnNeedFiles().length > 0){
                        $("#fileSubmit").click();
                    }else{
                        alert("璇峰厛閫変腑鏂囦欢鍐嶇偣鍑讳笂浼�");
                    }
                });

                // 濡傛灉蹇嵎娣诲姞鏂囦欢鎸夐挳瀛樺湪
                if($("#rapidAddImg").length > 0){
                    // 缁戝畾娣诲姞鐐瑰嚮浜嬩欢
                    $("#rapidAddImg").bind("click", function(e){
                        $("#fileImage").click();
                    });
                }
            };


            // 鍒濆鍖栦笂浼犳帶鍒跺眰鎻掍欢
            this.init();
        });
    };
})(jQuery);
