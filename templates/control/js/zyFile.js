/*
 * zyFile.js 鍩轰簬HTML5 鏂囦欢涓婁紶鐨勬牳蹇冭剼鏈� http://www.czlqibu.com
 * by zhangyan 2014-06-21   QQ : 623585268
*/

var ZYFILE = {
    fileInput : null,             // 閫夋嫨鏂囦欢鎸夐挳dom瀵硅薄
    uploadInput : null,           // 涓婁紶鏂囦欢鎸夐挳dom瀵硅薄
    dragDrop: null,				  //鎷栨嫿鏁忔劅鍖哄煙
    url : "",  					  // 涓婁紶action璺緞
    uploadFile : [],  			  // 闇€瑕佷笂浼犵殑鏂囦欢鏁扮粍
    lastUploadFile : [],          // 涓婁竴娆￠€夋嫨鐨勬枃浠舵暟缁勶紝鏂逛究缁х画涓婁紶浣跨敤
    perUploadFile : [],           // 瀛樻斁姘镐箙鐨勬枃浠舵暟缁勶紝鏂逛究鍒犻櫎浣跨敤
    fileNum : 0,                  // 浠ｈ〃鏂囦欢鎬讳釜鏁帮紝鍥犱负娑夊強鍒扮户缁坊鍔狅紝鎵€浠ヤ笅涓€娆℃坊鍔犻渶瑕佸湪瀹冪殑鍩虹涓婃坊鍔犵储寮�
    /* 鎻愪緵缁欏閮ㄧ殑鎺ュ彛 */
    filterFile : function(files){ // 鎻愪緵缁欏閮ㄧ殑杩囨护鏂囦欢鏍煎紡绛夌殑鎺ュ彛锛屽閮ㄩ渶瑕佹妸杩囨护鍚庣殑鏂囦欢杩斿洖
        return files;
    },
    onSelect : function(selectFile, files){      // 鎻愪緵缁欏閮ㄨ幏鍙栭€変腑鐨勬枃浠讹紝渚涘閮ㄥ疄鐜伴瑙堢瓑鍔熻兘  selectFile:褰撳墠閫変腑鐨勬枃浠�  allFiles:杩樻病涓婁紶鐨勫叏閮ㄦ枃浠�

    },
    onDelete : function(file, files){            // 鎻愪緵缁欏閮ㄨ幏鍙栧垹闄ょ殑鍗曚釜鏂囦欢锛屼緵澶栭儴瀹炵幇鍒犻櫎鏁堟灉  file:褰撳墠鍒犻櫎鐨勬枃浠�  files:鍒犻櫎涔嬪悗鐨勬枃浠�

    },
    onProgress : function(file, loaded, total){  // 鎻愪緵缁欏閮ㄨ幏鍙栧崟涓枃浠剁殑涓婁紶杩涘害锛屼緵澶栭儴瀹炵幇涓婁紶杩涘害鏁堟灉

    },
    onSuccess : function(file, responseInfo){    // 鎻愪緵缁欏閮ㄨ幏鍙栧崟涓枃浠朵笂浼犳垚鍔燂紝渚涘閮ㄥ疄鐜版垚鍔熸晥鏋�

    },
    onFailure : function(file, responseInfo){    // 鎻愪緵缁欏閮ㄨ幏鍙栧崟涓枃浠朵笂浼犲け璐ワ紝渚涘閮ㄥ疄鐜板け璐ユ晥鏋�

    },
    onComplete : function(responseInfo){         // 鎻愪緵缁欏閮ㄨ幏鍙栧叏閮ㄦ枃浠朵笂浼犲畬鎴愶紝渚涘閮ㄥ疄鐜板畬鎴愭晥鏋�

    },

    /* 鍐呴儴瀹炵幇鍔熻兘鏂规硶 */
    // 鑾峰緱閫変腑鐨勬枃浠�
    //鏂囦欢鎷栨斁
    funDragHover: function(e) {
        e.stopPropagation();
        e.preventDefault();
        this[e.type === "dragover"? "onDragOver": "onDragLeave"].call(e.target);
        return this;
    },
    // 鑾峰彇鏂囦欢
    funGetFiles : function(e){
        var self = this;
        // 鍙栨秷榧犳爣缁忚繃鏍峰紡
        this.funDragHover(e);
        // 浠庝簨浠朵腑鑾峰彇閫変腑鐨勬墍鏈夋枃浠�
        var files = e.target.files || e.dataTransfer.files;
        self.lastUploadFile = this.uploadFile;
        this.uploadFile = this.uploadFile.concat(this.filterFile(files));
        var tmpFiles = [];

        // 鍥犱负jquery鐨刬nArray鏂规硶鏃犳硶瀵筼bject鏁扮粍杩涜鍒ゆ柇鏄惁瀛樺湪浜庯紝鎵€浠ュ彧鑳芥彁鍙栧悕绉拌繘琛屽垽鏂�
        var lArr = [];  // 涔嬪墠鏂囦欢鐨勫悕绉版暟缁�
        var uArr = [];  // 鐜板湪鏂囦欢鐨勫悕绉版暟缁�
        $.each(self.lastUploadFile, function(k, v){
            lArr.push(v.name);
        });
        $.each(self.uploadFile, function(k, v){
            uArr.push(v.name);
        });

        $.each(uArr, function(k, v){
            // 鑾峰緱褰撳墠閫夋嫨鐨勬瘡涓€涓枃浠�   鍒ゆ柇褰撳墠杩欎竴涓枃浠舵槸鍚﹀瓨鍦ㄤ簬涔嬪墠鐨勬枃浠跺綋涓�
            if($.inArray(v, lArr) < 0){  // 涓嶅瓨鍦�
                tmpFiles.push(self.uploadFile[k]);
            }
        });

        // 濡傛灉tmpFiles杩涜杩囪繃婊や笂涓€娆￠€夋嫨鐨勬枃浠剁殑鎿嶄綔锛岄渶瑕佹妸杩囨护鍚庣殑鏂囦欢璧嬪€�
        //if(tmpFiles.length!=0){
        this.uploadFile = tmpFiles;
        //}

        // 璋冪敤瀵规枃浠跺鐞嗙殑鏂规硶
        this.funDealtFiles();

        return true;
    },
    // 澶勭悊杩囨护鍚庣殑鏂囦欢锛岀粰姣忎釜鏂囦欢璁剧疆涓嬫爣
    funDealtFiles : function(){
        var self = this;
        // 鐩墠鏄亶鍘嗘墍鏈夌殑鏂囦欢锛岀粰姣忎釜鏂囦欢澧炲姞鍞竴绱㈠紩鍊�
        $.each(this.uploadFile, function(k, v){
            // 鍥犱负娑夊強鍒扮户缁坊鍔狅紝鎵€浠ヤ笅涓€娆℃坊鍔犻渶瑕佸湪鎬讳釜鏁扮殑鍩虹涓婃坊鍔�
            v.index = self.fileNum;
            // 娣诲姞涓€涓箣鍚庤嚜澧�
            self.fileNum++;
        });
        // 鍏堟妸褰撳墠閫変腑鐨勬枃浠朵繚瀛樺浠�
        var selectFile = this.uploadFile;
        // 瑕佹妸鍏ㄩ儴鐨勬枃浠堕兘淇濆瓨涓嬫潵锛屽洜涓哄垹闄ゆ墍浣跨敤鐨勪笅鏍囨槸鍏ㄥ眬鐨勫彉閲�
        this.perUploadFile = this.perUploadFile.concat(this.uploadFile);
        // 鍚堝苟涓嬩笂浼犵殑鏂囦欢
        this.uploadFile = this.lastUploadFile.concat(this.uploadFile);

        // 鎵ц閫夋嫨鍥炶皟
        this.onSelect(selectFile, this.uploadFile);
        console.info("继续选择");
        console.info(this.uploadFile);
        return this;
    },
    // 澶勭悊闇€瑕佸垹闄ょ殑鏂囦欢  isCb浠ｈ〃鏄惁鍥炶皟onDelete鏂规硶
    // 鍥犱负涓婁紶瀹屾垚骞朵笉甯屾湜鍦ㄩ〉闈笂鍒犻櫎div锛屼絾鏄崟鐙偣鍑诲垹闄ょ殑鏃跺€欓渶瑕佸垹闄iv   鎵€浠ョ敤isCb鍋氬垽鏂�
    funDeleteFile : function(delFileIndex, isCb){
        var self = this;  // 鍦╡ach涓璽his鎸囧悜娌′釜v  鎵€浠ュ厛灏唗his淇濈暀

        var tmpFile = [];  // 鐢ㄦ潵鏇挎崲鐨勬枃浠舵暟缁�
        // 鍚堝苟涓嬩笂浼犵殑鏂囦欢
        var delFile = this.perUploadFile[delFileIndex];
        console.info(delFile);
        // 鐩墠鏄亶鍘嗘墍鏈夌殑鏂囦欢锛屽姣旀瘡涓枃浠�  鍒犻櫎
        $.each(this.uploadFile, function(k, v){
            if(delFile != v){
                // 濡傛灉涓嶆槸鍒犻櫎鐨勯偅涓枃浠� 灏辨斁鍒颁复鏃舵暟缁勪腑
                tmpFile.push(v);
            }else{

            }
        });
        this.uploadFile = tmpFile;
        if(isCb){  // 鎵ц鍥炶皟
            // 鍥炶皟鍒犻櫎鏂规硶锛屼緵澶栭儴杩涜鍒犻櫎鏁堟灉鐨勫疄鐜�
            self.onDelete(delFile, this.uploadFile);
        }

        console.info("杩樺墿杩欎簺鏂囦欢娌℃湁涓婁紶:");
        console.info(this.uploadFile);
        return true;
    },
    // 涓婁紶澶氫釜鏂囦欢
    funUploadFiles : function(){
        var self = this;  // 鍦╡ach涓璽his鎸囧悜娌′釜v  鎵€浠ュ厛灏唗his淇濈暀
        // 閬嶅巻鎵€鏈夋枃浠�  锛屽湪璋冪敤鍗曚釜鏂囦欢涓婁紶鐨勬柟娉�
        $.each(this.uploadFile, function(k, v){
            self.funUploadFile(v);
        });
    },
    // 涓婁紶鍗曚釜涓枃浠�
    funUploadFile : function(file){
        var self = this;  // 鍦╡ach涓璽his鎸囧悜娌′釜v  鎵€浠ュ厛灏唗his淇濈暀

        var formdata = new FormData();
        formdata.append("fileList", file);
        var xhr = new XMLHttpRequest();
        // 缁戝畾涓婁紶浜嬩欢
        // 杩涘害
        xhr.upload.addEventListener("progress",	 function(e){
            // 鍥炶皟鍒板閮�
            self.onProgress(file, e.loaded, e.total);
        }, false);
        // 瀹屾垚
        xhr.addEventListener("load", function(e){
            // 浠庢枃浠朵腑鍒犻櫎涓婁紶鎴愬姛鐨勬枃浠�  false鏄笉鎵цonDelete鍥炶皟鏂规硶
            self.funDeleteFile(file.index, false);
            // 鍥炶皟鍒板閮�
            self.onSuccess(file, xhr.responseText);
            if(self.uploadFile.length==0){
                // 鍥炶皟鍏ㄩ儴瀹屾垚鏂规硶
                self.onComplete("鍏ㄩ儴瀹屾垚");
            }
        }, false);
        // 閿欒
        xhr.addEventListener("error", function(e){
            // 鍥炶皟鍒板閮�
            self.onFailure(file, xhr.responseText);
        }, false);

        xhr.open("POST",self.url, true);
        let timeStamp = JSON.stringify(new Date().valueOf())
        xhr.setRequestHeader("X_FILENAME", timeStamp);//不要出现中文字符：file.name：make by lucklidi@126.com
        xhr.send(formdata);
    },
    // 杩斿洖闇€瑕佷笂浼犵殑鏂囦欢
    funReturnNeedFiles : function(){
        return this.uploadFile;
    },

    // 鍒濆鍖�
    init : function(){  // 鍒濆鍖栨柟娉曪紝鍦ㄦ缁欓€夋嫨銆佷笂浼犳寜閽粦瀹氫簨浠�
        var self = this;  // 鍏嬮殕涓€涓嚜韬�

        if (this.dragDrop) {
            this.dragDrop.addEventListener("dragover", function(e) { self.funDragHover(e); }, false);
            this.dragDrop.addEventListener("dragleave", function(e) { self.funDragHover(e); }, false);
            this.dragDrop.addEventListener("drop", function(e) { self.funGetFiles(e); }, false);
        }

        // 濡傛灉閫夋嫨鎸夐挳瀛樺湪
        if(self.fileInput){
            // 缁戝畾change浜嬩欢
            this.fileInput.addEventListener("change", function(e) {
                self.funGetFiles(e);
            }, false);
        }

        // 濡傛灉涓婁紶鎸夐挳瀛樺湪
        if(self.uploadInput){
            // 缁戝畾click浜嬩欢
            this.uploadInput.addEventListener("click", function(e) {
                self.funUploadFiles(e);
            }, false);
        }
    }
};
















