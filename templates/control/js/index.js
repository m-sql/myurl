var operimg_id;
var zoom_rate=100;
var zoom_timeout;
function rotateimg(){
    var smallImg=$("#"+operimg_id);
    var num=smallImg.attr('curr_rotate');
    if(num==null){
        num=0;
    }
    num=parseInt(num);
    num +=1;
    smallImg.attr('curr_rotate',num);

    $("#show_img").rotate({angle:90*num});
    smallImg.rotate({angle:90*num});
}

function createOpenBox(){
    if($('#operimg_box').length==0){
        var html = '    <div class="operimg_box" id="operimg_box">';
        html += '       <img id="show_img" src="" onclick="get_imgsize()" />';
        html += '       <span class="set_img percent_img" id="zoom_show" >percent</span>';
        html += '       <span class="set_img zoomin" onclick="zoomIn()"></span>';
        html += '       <span class="set_img zoomout" onclick="zoomOut()"></span>';
        html += '       <span class="set_img ratateimg" id="btn_rotateimg" onclick="rotateimg()"></span>';
        html += '       <span class="set_img close_img" id="delimg"></span>';
        html += '       <span class="set_img arrowleft" onclick="prevImg()"></span>';
        html += '       <span class="set_img arrowright" onclick="nextImg()"></span>';
        html += '       <span class="set_img operarea_box"></span>';
        html += '   </div><div class="clearboth"></div><div id="mask_bg">dfdfdfdfdfd</div>';
        $('body').append(html);
    }
}
function get_imgsize(){
    var img_size=$("#show_img").width();
    //alert(img_size);
}

function setNewIndex(isNext) {
    var imgs = $('#preview').find('img[class="upload_image"]');
    var imgCount = imgs.length;
    var currIndex=0;
    for(var i=0;i<imgCount;i++){
        if($(imgs[i]).attr('id')==operimg_id){
            currIndex = i;
            break;
        }
    }

    if (isNext) {
        currIndex += 1;
        if (currIndex >= imgCount) {
            currIndex = 0;
        }
    } else {
        currIndex -= 1;
        if (currIndex < 0) {
            currIndex  =imgCount-1;
        }
    }

    return $(imgs[currIndex]).attr('id').replace('uploadImage_','');
}
function nextImg() {
    var index = setNewIndex(true);
    setimgbox(index);
}
function prevImg() {
    var index = setNewIndex(false);
    setimgbox(index);
}
function zoomIn() {
    zoom_rate += 10;
    doZoom(zoom_rate);
    setoperimgbox();
}
function zoomOut() {
    zoom_rate -= 10;
    doZoom(zoom_rate);
    setoperimgbox();
}

function doZoom(zoom_rate){
    //$("#show_img").css('width', zoom_rate + '%').css('height', zoom_rate + '%');
    var naturalWidth= $("#show_img")[0].naturalWidth;
    $("#show_img").css('width', naturalWidth*zoom_rate*0.01+'px');

    clearTimeout(zoom_timeout);
    zoom_rate=parseInt(zoom_rate);
    $("#zoom_show").show();
    $("#zoom_show").html(zoom_rate+'%');
    zoom_timeout=setTimeout(function (){
        $("#zoom_show").hide('fast');
    },1000);
}
function setoperimgbox(){
    var obImage=$("#operimg_box");
    var ob_width = obImage.width();
    var ob_height = obImage.height();
    //alert(ob_width +":"+ob_height);
    var ob_left = (window.innerWidth-ob_width)/2;
    var ob_top = (window.innerHeight-ob_height)/2;
    console.log(ob_left+"   "+ob_top+" "+ ob_width+" "+ob_height+" "+window.innerWidth+" "+window.innerHeight);
    $("#operimg_box").css("left",ob_left).css("top",ob_top);
    $("#mask_bg").show();
    $("#operimg_box").show();
}


/*鍒犻櫎*/
function delimg(index){
    //var imgboxid=$(x).parent().parent().attr("id");
    var smallimgbox='uploadList_'+index;
    ZYFILE.funDeleteFile(parseInt(index), true)
    $("#"+smallimgbox).remove();

}

function setimgbox(index){
    createOpenBox();
    zoom_rate = 100;
    operimg_id='uploadImage_'+index;

    var smallImg=$("#"+operimg_id);

    // alert(smallImg[0].naturalWidth);

    var naturalWidth=smallImg[0].naturalWidth;
    var naturalHeight=smallImg[0].naturalHeight;
    zoom_rate=600/Math.max(naturalWidth,naturalHeight)*100;

    $("#show_img").attr("src",smallImg.attr('src'));
    $("#mask_bg").show();
    $("#operimg_box").show();
    //$("#show_img").css('width', zoom_rate + '%').css('height', zoom_rate + '%');
    $("#show_img").css('width', naturalWidth*zoom_rate*0.01+'px');

    var num=$("#"+operimg_id).attr('curr_rotate');
    $("#show_img").rotate({angle:90*num});

    $("#delimg").click(function(){
        $("#show_img").attr("src","");
        $("#operimg_box").hide();
        $("#mask_bg").hide();
    });

    setoperimgbox();
}
/**/
//寮曠敤鍒濆鍖朖S
$(function(){
    // 鍒濆鍖栨彃浠�
    $("#demo").zyUpload({
        width            :   "650px",                 // 瀹藉害
        height           :   "400px",                 // 瀹藉害
        itemWidth        :   "120px",                 // 鏂囦欢椤圭殑瀹藉害
        itemHeight       :   "100px",                 // 鏂囦欢椤圭殑楂樺害
        url              :   "/upload/UploadAction",  // 涓婁紶鏂囦欢鐨勮矾寰�
        multiple         :   true,                    // 鏄惁鍙互澶氫釜鏂囦欢涓婁紶
        dragDrop         :   true,                    // 鏄惁鍙互鎷栧姩涓婁紶鏂囦欢
        del              :   true,                    // 鏄惁鍙互鍒犻櫎鏂囦欢
        finishDel        :   false,                   // 鏄惁鍦ㄤ笂浼犳枃浠跺畬鎴愬悗鍒犻櫎棰勮
        /* 澶栭儴鑾峰緱鐨勫洖璋冩帴鍙� */
        onSelect: function(files, allFiles){                    // 閫夋嫨鏂囦欢鐨勫洖璋冩柟娉�
            console.info("褰撳墠閫夋嫨浜嗕互涓嬫枃浠讹細");
            console.info(files);
            console.info("涔嬪墠娌′笂浼犵殑鏂囦欢锛�");
            console.info(allFiles);
        },
        onDelete: function(file, surplusFiles){                     // 鍒犻櫎涓€涓枃浠剁殑鍥炶皟鏂规硶
            console.info("褰撳墠鍒犻櫎浜嗘鏂囦欢锛�");
            console.info(file);
            console.info("褰撳墠鍓╀綑鐨勬枃浠讹細");
            console.info(surplusFiles);
        },
        onSuccess: function(file){                    // 鏂囦欢涓婁紶鎴愬姛鐨勫洖璋冩柟娉�
            console.info("姝ゆ枃浠朵笂浼犳垚鍔燂細");
            console.info(file);
        },
        onFailure: function(file){                    // 鏂囦欢涓婁紶澶辫触鐨勫洖璋冩柟娉�
            console.info("姝ゆ枃浠朵笂浼犲け璐ワ細");
            console.info(file);
        },
        onComplete: function(responseInfo){           // 涓婁紶瀹屾垚鐨勫洖璋冩柟娉�
            console.info("鏂囦欢涓婁紶瀹屾垚");
            console.info(responseInfo);
        }
    });
});
