(function(){
  "use strict";
  function pc(v){ return Math.round(v*100)+"%"; }
  function x2(v){ return v.toFixed(2)+"x"; }
  var $ = function(id){ return document.getElementById(id); };

  /* ================== 滤镜 ================== */
  var PRESETS = {
    ccd:  { cn:"CCD", en:"CCD", desc:"二〇〇几年卡片机：对比高、颜色浓、微微偏绿，带细颗粒和一点镜头光晕。",
            tintColor:"#7FBF6A",
            p:{bri:1.06,con:1.12,sat:1.18,hue:-3,sep:0,gry:0,blr:0,tint:0,bloom:.10,grain:.05,scan:0,vig:.4} },
    kodak:{ cn:"暖胶片", en:"KODAK", desc:"暖黄底子，肤色红润，高光化开。拍人最讨好的一档。",
            tintColor:"#FFC46B", warm:1,
            p:{bri:1.06,con:1.06,sat:1.18,hue:-6,sep:.10,gry:0,blr:.1,tint:.14,bloom:.16,grain:.05,scan:0,vig:.3} },
    cream:{ cn:"奶油", en:"CREAM", desc:"高调柔和，对比压低，气色好、不锐利，适合近距离说话。",
            tintColor:"#FFE3C0", warm:1,
            p:{bri:1.12,con:.9,sat:.98,hue:0,sep:.1,gry:0,blr:.25,tint:.16,bloom:.22,grain:.03,scan:0,vig:.2} },
    fuji: { cn:"冷胶片", en:"FUJI", desc:"青绿底子，通透干净，白天靠窗最好看。",
            tintColor:"#7FD4C0",
            p:{bri:1.06,con:1.04,sat:1.02,hue:7,sep:0,gry:0,blr:0,tint:.10,bloom:.10,grain:.04,scan:0,vig:.28} },
    pola: { cn:"拍立得", en:"POLA", desc:"一次成像：亮、对比低、泛奶黄，边缘轻轻发白。",
            tintColor:"#FFD9A0", warm:1,
            p:{bri:1.12,con:.9,sat:1.12,hue:0,sep:.18,gry:0,blr:.1,tint:.13,bloom:.2,grain:.05,scan:0,vig:.28} },
    teal: { cn:"青橙", en:"TEAL", desc:"电影调色方向：暗部偏青，肤色偏暖，立体感强。",
            tintColor:"#2E8B8B",
            p:{bri:1.02,con:1.14,sat:1.15,hue:-6,sep:0,gry:0,blr:0,tint:.14,bloom:.08,grain:.03,scan:0,vig:.4} },
    crt:  { cn:"显像管", en:"CRT", desc:"老电视的荧光感：颜色发亮、高光化开、边角发暗，没有横条纹。",
            tintColor:"#8FD8FF",
            p:{bri:1.05,con:1.12,sat:1.24,hue:0,sep:0,gry:0,blr:.35,tint:.06,bloom:.34,grain:.05,scan:0,vig:.42} },
    vhs:  { cn:"录像带", en:"VHS", desc:"家用录像带：色彩溢出、轻微失焦、亮部发糊，没有雪花和条纹。",
            tintColor:"#FFB0C8",
            p:{bri:1.08,con:.94,sat:1.42,hue:0,sep:0,gry:0,blr:.75,tint:.08,bloom:.28,grain:.06,scan:0,vig:.32} },
    "8mm":{ cn:"八毫米", en:"8MM", desc:"老家庭录像的暖棕调，柔和、边缘压暗。", warm:1,
            p:{bri:1.02,con:1.1,sat:1.28,hue:0,sep:.45,gry:0,blr:.25,tint:0,bloom:.18,grain:.10,scan:0,vig:.55} },
    fade: { cn:"褪色", en:"FADE", desc:"放旧了的照片，颜色掉一半，黑位发灰。",
            tintColor:"#E8D8C0",
            p:{bri:1.1,con:.82,sat:.7,hue:0,sep:.25,gry:0,blr:0,tint:.15,bloom:.12,grain:.06,scan:0,vig:.2} },
    cool: { cn:"冷调", en:"COOL", desc:"偏蓝的清冷调子，深夜说话的感觉。", tintColor:"#4A78FF", cold:1,
            p:{bri:1.04,con:1.12,sat:.82,hue:-16,sep:0,gry:0,blr:0,tint:.10,bloom:.1,grain:.04,scan:0,vig:.5} },
    bw:   { cn:"黑白", en:"B&W", desc:"高反差黑白，只剩表情和光线。",
            p:{bri:1.05,con:1.32,sat:1,hue:0,sep:0,gry:1,blr:0,tint:0,bloom:.1,grain:.06,scan:0,vig:.5} },
    silver:{cn:"银盐", en:"SILVER", desc:"柔一点的黑白，中灰厚，接近老照片。",
            p:{bri:1.06,con:1.1,sat:1,hue:0,sep:.15,gry:1,blr:.2,tint:0,bloom:.16,grain:.09,scan:0,vig:.4} },
    nv:   { cn:"夜视", en:"NV", desc:"绿色夜视仪：高增益、噪点重、边缘压黑，没有扫描线。",
            p:{bri:1.12,con:1.45,sat:4,hue:55,sep:1,gry:1,blr:.15,tint:0,bloom:.26,grain:.16,scan:0,vig:.78} },
    ir:   { cn:"红外", en:"IR", desc:"红外摄影：草木发白，整体泛品红。", tintColor:"#FF69B4",
            p:{bri:1.05,con:1.2,sat:3,hue:-40,sep:1,gry:1,blr:0,tint:.18,bloom:.14,grain:.06,scan:0,vig:.5} },
    off:  { cn:"原图", en:"OFF", desc:"不做任何颜色处理。",
            p:{bri:1,con:1,sat:1,hue:0,sep:0,gry:0,blr:0,tint:0,bloom:0,grain:0,scan:0,vig:0} }
  };
  var SLIDERS = [
    { k:"bri",cn:"亮度",tip:"整体明暗",min:.4,max:1.8,step:.01,fmt:x2 },
    { k:"con",cn:"对比",tip:"黑白拉开程度",min:.4,max:2.2,step:.01,fmt:x2 },
    { k:"sat",cn:"饱和",tip:"颜色浓淡",min:0,max:4,step:.05,fmt:x2 },
    { k:"hue",cn:"色相",tip:"偏色方向",min:-180,max:180,step:1,fmt:function(v){return Math.round(v)+"°"} },
    { k:"sep",cn:"怀旧棕",tip:"往老照片的棕靠",min:0,max:1,step:.01,fmt:pc },
    { k:"gry",cn:"去色",tip:"抽掉原始颜色",min:0,max:1,step:.01,fmt:pc },
    { k:"tint",cn:"染色",tip:"滤镜自带的颜色",min:0,max:.5,step:.01,fmt:pc },
    { k:"blr",cn:"柔焦",tip:"轻微失焦",min:0,max:4,step:.05,fmt:function(v){return v.toFixed(2)+"px"} },
    { k:"bloom",cn:"光晕",tip:"亮部化开，古早镜头感",min:0,max:.8,step:.01,fmt:pc },
    { k:"grain",cn:"颗粒",tip:"胶片噪点",min:0,max:.4,step:.01,fmt:function(v){return Math.round(v*250)+""} },
    { k:"scan",cn:"横纹",tip:"默认关闭",min:0,max:.35,step:.01,fmt:function(v){return v<=0?"关":Math.round(v*280)+""} },
    { k:"vig",cn:"暗角",tip:"四周压暗",min:0,max:1,step:.01,fmt:pc }
  ];

  var WARP = [
    { k:"eye",cn:"大眼",tip:"以眼球为中心放大",min:0,max:1,step:.01,fmt:pc },
    { k:"nose",cn:"缩鼻",tip:"鼻头鼻翼收小",min:0,max:1,step:.01,fmt:pc },
    { k:"mouth",cn:"嘴型",tip:"左小右大",min:-1,max:1,step:.01,fmt:function(v){return Math.round(v*100)+""} },
    { k:"slim",cn:"瘦脸",tip:"颧骨到下颌整条轮廓收窄",min:0,max:1,step:.01,fmt:pc },
    { k:"chin",cn:"下巴",tip:"嘴以下垂直收短",min:0,max:1,step:.01,fmt:pc },
    { k:"brow",cn:"开眼角",tip:"眼尾往外拉一点",min:0,max:1,step:.01,fmt:pc }
  ];
  var WARP_DEFAULT = { eye:.25, nose:.15, mouth:0, slim:.2, chin:.1, brow:.1 };

  var LOCAL = [
    { k:"trough",cn:"淡化泪沟",tip:"取旁边的皮肤填平凹陷",min:0,max:1,step:.01,fmt:pc },
    { k:"fold",cn:"淡化法令纹",tip:"取脸颊外侧皮肤填平",min:0,max:1,step:.01,fmt:pc },
    { k:"eyeLight",cn:"眼神提亮",tip:"眼睛更清楚",min:0,max:1,step:.01,fmt:pc },
    { k:"lipBoost",cn:"唇色",tip:"嘴唇加一点血色",min:0,max:1,step:.01,fmt:pc },
    { k:"teeth",cn:"牙齿提亮",tip:"张嘴时才看得出",min:0,max:1,step:.01,fmt:pc }
  ];
  var SKIN = [
    { k:"smooth",cn:"磨皮",tip:"皮肤变均匀",min:0,max:1,step:.01,fmt:pc },
    { k:"detail",cn:"保留细节",tip:"找回真实质感",min:0,max:1,step:.01,fmt:pc },
    { k:"even",cn:"匀肤色",tip:"减轻泛红和色块",min:0,max:1,step:.01,fmt:pc },
    { k:"warm",cn:"肤色暖度",tip:"往红润方向拉",min:0,max:1,step:.01,fmt:pc },
    { k:"lift",cn:"面部提亮",tip:"整张脸抬亮一点",min:0,max:1,step:.01,fmt:pc },
    { k:"glow",cn:"柔光",tip:"高光晕开",min:0,max:1,step:.01,fmt:pc },
    { k:"range",cn:"作用范围",tip:"面部遮罩大小",min:.7,max:1.3,step:.01,fmt:x2 },
    { k:"feather",cn:"边缘羽化",tip:"过渡宽度",min:.2,max:2,step:.05,fmt:x2 }
  ];
  var SKIN_DEFAULT = {
    trough:.6, fold:.5, eyeLight:.2, lipBoost:.15, teeth:.15,
    smooth:.16, detail:.5, even:.22, warm:.15, lift:.08, glow:.1, range:1, feather:1
  };

  var MOSAIC = {
    off:{cn:"关闭",en:"OFF",desc:"不打码。"},
    block:{cn:"方块",en:"BLOCK",desc:"最经典的马赛克，整块色。"},
    dot:{cn:"圆点",en:"DOT",desc:"每格一个圆点，之间露底色。"},
    diamond:{cn:"菱形",en:"DIA",desc:"方块转四十五度，像织物纹样。"},
    half:{cn:"半调",en:"HALF",desc:"报纸印刷网点：越亮点越小。"},
    hbar:{cn:"横条",en:"HBAR",desc:"横向色带，像老式液晶。"},
    vbar:{cn:"竖条",en:"VBAR",desc:"竖向色带，像百叶窗。"},
    cross:{cn:"十字",en:"CROSS",desc:"十字针脚，像十字绣。"},
    ring:{cn:"空心圈",en:"RING",desc:"描边圆环，轻薄不闷。"},
    ascii:{cn:"字符",en:"ASCII",desc:"用符号疏密拼明暗，脸完全认不出。"}
  };
  var MOSLIDERS = [
    { k:"cell",cn:"格子大小",tip:"越大越糊",min:4,max:48,step:1,fmt:function(v){return Math.round(v)+"px"} },
    { k:"gap",cn:"格子间隙",tip:"露出多少底色",min:0,max:.6,step:.02,fmt:pc },
    { k:"amount",cn:"覆盖强度",tip:"和原画面的混合",min:.1,max:1,step:.01,fmt:pc },
    { k:"bg",cn:"底色明度",tip:"格子之间那层深浅",min:0,max:1,step:.01,fmt:pc },
    { k:"faceOnly",cn:"只打码脸部",tip:"需要面捕",min:0,max:1,step:1,fmt:function(v){return v>=1?"开":"关"} }
  ];
  var MO_DEFAULT = { cell:14, gap:.12, amount:1, bg:.06, faceOnly:0 };

  /* 纹路：一条从 A 到 B 的曲线带，偏移量以脸长为单位，存的是未翻转的图像空间 */
  var RGN_KEYS = ["troughL","troughR","foldL","foldR"];
  var RGN_LABEL = { troughL:"泪沟一", troughR:"泪沟二", foldL:"法令纹一", foldR:"法令纹二" };
  function rgnDefault(){
    var o = {};
    RGN_KEYS.forEach(function(k){ o[k] = { ax:0, ay:0, bx:0, by:0, w:1 }; });
    return o;
  }

  var CUE_SLIDERS = [
    { k:"size",cn:"字号",tip:"占画面高度的比例",min:2.5,max:9,step:.1,fmt:function(v){return v.toFixed(1)+"%"} },
    { k:"opacity",cn:"文字透明度",tip:"当前这句的浓淡",min:.2,max:1,step:.01,fmt:pc },
    { k:"dim",cn:"其他句透明度",tip:"前后文的浓淡",min:0,max:1,step:.01,fmt:pc },
    { k:"lines",cn:"显示行数",tip:"当前句上下各留几行",min:1,max:7,step:1,fmt:function(v){return Math.round(v)+" 行"} },
    { k:"bg",cn:"背景条",tip:"底色深浅，0 是全透明",min:0,max:.8,step:.01,fmt:pc },
    { k:"width",cn:"宽度",tip:"提词条占画面宽度",min:30,max:96,step:1,fmt:function(v){return Math.round(v)+"%"} }
  ];
  var CUE_DEFAULT = { size:4.2, opacity:.95, dim:.3, lines:2, bg:.22, width:88 };
  var CUE_COLORS = ["#FBFDF8","#FFD9A8","#B8E6A0","#9CD2FF","#FFB3C7","#2B2A25"];

  var S = {
    source:"cam", lang:"zh-CN", stream:null, canvasStream:null, recorder:null,
    recording:false, paused:false, takes:[], counter:0,
    startAt:0, elapsed:0, chunks:[], finalText:"", interimText:"",
    recog:null, recogWanted:false, altText:"", cueMarks:[], asrMarks:[], audioCtx:null, analyser:null, audioData:null,
    raf:0, tick:0, thumb:null, stamp:"", fx:"kodak", dateOn:true, flip:false,
    frame:0, custom:{}, recFx:"KODAK",
    skin: JSON.parse(JSON.stringify(SKIN_DEFAULT)),
    warp: JSON.parse(JSON.stringify(WARP_DEFAULT)),
    rgn: rgnDefault(), rgnSel:"troughL",
    mo:"off", moP: JSON.parse(JSON.stringify(MO_DEFAULT)),
    faceOn:true, editing:false, lm:null, sm:null, lmAt:0, faceState:"loading",
    cue: JSON.parse(JSON.stringify(CUE_DEFAULT)),
    sub: null,
    cueColor:"#FBFDF8", cueAlign:"center", cuePos:{x:6,y:66},
    cueLines:[], cueIdx:0, cueAuto:true, cueRehearse:false, cueOn:true, cueRaw:""
  };

  var preview = $("preview"), cv = $("canvas"), stage = $("stage"), stageEmpty = $("stageEmpty");
  var ctx = cv.getContext("2d");
  var osd = $("osd"), timerEl = $("timer"), levelEl = $("level"), recWord = $("recWord");
  var liveEl = $("live"), warnEl = $("warn"), faceOsd = $("faceOsd");
  var editLayer = $("editLayer"), editPath = $("editPath"), cueEl = $("cue");
  var btnConnect = $("btnConnect"), btnRec = $("btnRec"),
      btnPause = $("btnPause"), btnDiscard = $("btnDiscard");

  function mkc(){ return document.createElement("canvas"); }
  var bc = mkc(), bx = bc.getContext("2d");
  var mk = mkc(), kx = mk.getContext("2d");
  var tp = mkc(), tx = tp.getContext("2d");
  var og = mkc(), ox = og.getContext("2d");
  var bl = mkc(), lx = bl.getContext("2d");
  var mc = mkc(), sx2 = mc.getContext("2d", { willReadFrequently:true });
  var mo2 = mkc(), m2x = mo2.getContext("2d");
  var glc = mkc();

  var FILTER_OK = (function(){
    try { ctx.filter = "blur(1px)"; var ok = ctx.filter !== "none"; ctx.filter = "none"; return ok; }
    catch(e){ return false; }
  })();

  var grainTile = mkc(); grainTile.width = grainTile.height = 96;
  (function(){
    var g = grainTile.getContext("2d"), im = g.createImageData(96,96);
    for (var i=0;i<im.data.length;i+=4){
      var v = 90 + Math.random()*165;
      im.data[i]=im.data[i+1]=im.data[i+2]=v; im.data[i+3]=255;
    }
    g.putImageData(im,0,0);
  })();
  var grainPat = ctx.createPattern(grainTile,"repeat");
  var ASCII = " .,:;irsXA253hMHGS#9B&@";

  var IDX = {
    oval:[10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109],
    eyeL:[33,7,163,144,145,153,154,155,133,173,157,158,159,160,161,246],
    eyeR:[362,382,381,380,374,373,390,249,263,466,388,387,386,385,384,398],
    browL:[70,63,105,66,107,55,65,52,53,46],
    browR:[300,293,334,296,336,285,295,282,283,276],
    lips:[61,146,91,181,84,17,314,405,321,375,291,409,270,269,267,0,37,39,40,185],
    mouthIn:[78,95,88,178,87,14,317,402,318,324,308,415,310,311,312,13,82,81,80,191],
    noseL:129, noseR:358, noseTip:1, mouthL:61, mouthR:291, mouthC:13,
    chin:152, top:10, cheekL:234, cheekR:454, eyeOutL:33, eyeOutR:263,
    eyeInL:133, eyeInR:362, lidMidL:145, lidMidR:374, lidUpL:159, lidUpR:386
  };

  function two(n){ return String(n).padStart(2,"0"); }
  function stampNow(){
    var d = new Date();
    return "'" + two(d.getFullYear()%100) + " " + two(d.getMonth()+1) + " " + two(d.getDate())
         + "  " + two(d.getHours()) + ":" + two(d.getMinutes());
  }
  var d0 = new Date();
  $("today").textContent = d0.getFullYear() + "." + two(d0.getMonth()+1) + "." + two(d0.getDate());

  for (var i=0;i<16;i++){ levelEl.appendChild(document.createElement("i")); }
  var bars = levelEl.querySelectorAll("i");

  function warn(msg){
    if(!msg){ warnEl.hidden = true; return; }
    warnEl.textContent = msg; warnEl.hidden = false;
  }
  function fmt(ms){
    var t = Math.floor(ms/1000);
    return Math.floor(t/3600) + ":" + two(Math.floor(t%3600/60)) + ":" + two(t%60);
  }
  function fmtShort(ms){
    var t = Math.floor(ms/1000);
    return two(Math.floor(t/60)) + ":" + two(t%60);
  }
  function srtTime(ms){
    return two(Math.floor(ms/3600000))+":"+two(Math.floor(ms%3600000/60000))+":"+
           two(Math.floor(ms%60000/1000))+","+String(Math.floor(ms%1000)).padStart(3,"0");
  }
  function hexRgb(h){
    h = h.replace("#","");
    return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];
  }

  /* ================== 控件工厂 ================== */
  function buildSliders(container, defs, getObj, onChange){
    var refs = {};
    defs.forEach(function(d){
      var el = document.createElement("div");
      el.className = "sl";
      el.innerHTML = '<div class="lab"><b></b><span class="tp"></span><span class="val"></span></div><input type="range">';
      el.querySelector("b").textContent = d.cn;
      el.querySelector(".tp").textContent = d.tip;
      var r = el.querySelector("input");
      r.min = d.min; r.max = d.max; r.step = d.step;
      r.setAttribute("aria-label", d.cn + "，" + d.tip);
      r.oninput = function(){
        getObj()[d.k] = parseFloat(r.value);
        el.querySelector(".val").textContent = d.fmt(parseFloat(r.value));
        if (onChange) onChange();
        save();
      };
      container.appendChild(el);
      refs[d.k] = { range:r, val:el.querySelector(".val") };
    });
    return { sync:function(){
      var o = getObj();
      defs.forEach(function(d){
        var v = (o[d.k] === undefined) ? d.min : o[d.k];
        refs[d.k].range.value = v;
        refs[d.k].val.textContent = d.fmt(parseFloat(v));
      });
    }};
  }
  function params(fx){
    if (!S.custom[fx]) S.custom[fx] = JSON.parse(JSON.stringify(PRESETS[fx].p));
    return S.custom[fx];
  }
  function cur(){ return params(S.fx); }

  var vigCache = null, vigKey = "";
  var fxUI    = buildSliders($("sliders"),  SLIDERS,   cur, function(){ vigKey = ""; });
  var warpUI  = buildSliders($("warpBox"),  WARP,      function(){ return S.warp; });
  var localUI = buildSliders($("localBox"), LOCAL,     function(){ return S.skin; });
  var skinUI  = buildSliders($("skinBox"),  SKIN,      function(){ return S.skin; });
  var moUI    = buildSliders($("mosliders"),MOSLIDERS, function(){ return S.moP; });
  var cueUI   = buildSliders($("cueBox"),   CUE_SLIDERS, function(){ return S.cue; }, function(){ renderCue(); });

  Object.keys(PRESETS).forEach(function(k){
    var b = document.createElement("button");
    b.className = "chip"; b.type = "button"; b.dataset.fx = k; b.title = PRESETS[k].desc;
    b.innerHTML = "<b></b><span></span>";
    b.querySelector("b").textContent = PRESETS[k].cn;
    b.querySelector("span").textContent = PRESETS[k].en;
    b.onclick = function(){ setFx(k); };
    $("chips").appendChild(b);
  });
  Object.keys(MOSAIC).forEach(function(k){
    var b = document.createElement("button");
    b.className = "chip"; b.type = "button"; b.dataset.mo = k; b.title = MOSAIC[k].desc;
    b.innerHTML = "<b></b><span></span>";
    b.querySelector("b").textContent = MOSAIC[k].cn;
    b.querySelector("span").textContent = MOSAIC[k].en;
    b.onclick = function(){ setMo(k); };
    $("mochips").appendChild(b);
  });
  RGN_KEYS.forEach(function(k){
    var b = document.createElement("button");
    b.className = "chip"; b.type = "button"; b.dataset.rgn = k;
    b.innerHTML = "<b></b>";
    b.querySelector("b").textContent = RGN_LABEL[k];
    b.onclick = function(){ setRgn(k); };
    $("rgnChips").appendChild(b);
  });
  CUE_COLORS.forEach(function(c){
    var b = document.createElement("button");
    b.className = "swatch"; b.type = "button"; b.style.background = c;
    b.setAttribute("aria-label","提词颜色 " + c);
    b.onclick = function(){
      S.cueColor = c;
      document.querySelectorAll(".swatch").forEach(function(o){ o.setAttribute("aria-pressed", o === b); });
      renderCue(); save();
    };
    if (c === S.cueColor) b.setAttribute("aria-pressed","true");
    $("cueColors").appendChild(b);
  });

  function setFx(v){
    S.fx = v;
    document.querySelectorAll("#chips .chip").forEach(function(b){ b.setAttribute("aria-pressed", b.dataset.fx === v); });
    $("fxdesc").textContent = PRESETS[v].desc;
    params(v); fxUI.sync(); vigKey = ""; save();
  }
  function setMo(v){
    S.mo = v;
    document.querySelectorAll("#mochips .chip").forEach(function(b){ b.setAttribute("aria-pressed", b.dataset.mo === v); });
    $("modesc").textContent = MOSAIC[v].desc;
    save();
  }
  function setRgn(v){
    S.rgnSel = v;
    document.querySelectorAll("#rgnChips .chip").forEach(function(b){ b.setAttribute("aria-pressed", b.dataset.rgn === v); });
    $("editTip").textContent = "正在调整「" + RGN_LABEL[v] + "」。拖两端圆点定起止和倾斜，白点整体移动，方块调粗细。";
  }
  $("btnResetFx").onclick = function(){
    S.custom[S.fx] = JSON.parse(JSON.stringify(PRESETS[S.fx].p));
    fxUI.sync(); vigKey = ""; save();
  };
  $("btnResetSkin").onclick = function(){
    S.skin = JSON.parse(JSON.stringify(SKIN_DEFAULT));
    S.warp = JSON.parse(JSON.stringify(WARP_DEFAULT));
    localUI.sync(); skinUI.sync(); warpUI.sync(); save();
  };
  $("btnZeroSkin").onclick = function(){
    Object.keys(S.skin).forEach(function(k){ S.skin[k] = (k==="range"||k==="feather") ? 1 : 0; });
    Object.keys(S.warp).forEach(function(k){ S.warp[k] = 0; });
    localUI.sync(); skinUI.sync(); warpUI.sync(); save();
  };
  $("btnResetRgn").onclick = function(){ S.rgn = rgnDefault(); save(); };

  var tabs = [["tabCue","paneCue"],["tabSkin","paneSkin"],["tabFx","paneFx"],["tabMo","paneMo"]];
  tabs.forEach(function(t){
    $(t[0]).onclick = function(){
      tabs.forEach(function(o){
        var on = o[0] === t[0];
        $(o[0]).setAttribute("aria-selected", on);
        $(o[1]).hidden = !on;
      });
    };
  });

  /* ================== 提词器 ================== */
  function splitCue(raw){
    return raw.split(/\n+/).map(function(s){ return s.trim(); }).filter(Boolean);
  }
  function renderCue(){
    var c = S.cue;
    cueEl.hidden = !S.cueOn || !S.cueLines.length;
    if (cueEl.hidden) return;
    cueEl.style.left = S.cuePos.x + "%";
    cueEl.style.top = S.cuePos.y + "%";
    cueEl.style.width = c.width + "%";
    cueEl.style.textAlign = S.cueAlign;
    cueEl.style.background = c.bg > 0 ? "rgba(8,10,6," + c.bg + ")" : "transparent";
    var stageH = stage.clientHeight || 400;
    var px = Math.max(11, stageH * c.size / 100);
    var span = Math.round(c.lines);
    var from = Math.max(0, S.cueIdx - span), to = Math.min(S.cueLines.length-1, S.cueIdx + span);
    var html = '<div class="grip"></div>';
    for (var i=from;i<=to;i++){
      var now = (i === S.cueIdx);
      var op = now ? c.opacity : c.dim;
      var sz = now ? px : px*0.78;
      html += '<div class="ln' + (now?" now":"") + '" style="opacity:' + op + ';font-size:' + sz + 'px">' +
              escapeHtml(S.cueLines[i]) + '</div>';
    }
    cueEl.innerHTML = html;
    cueEl.style.color = S.cueColor;
    cueEl.style.textShadow = (S.cueColor === "#2B2A25")
      ? "0 1px 3px rgba(255,255,255,.7)"
      : "0 1px 4px rgba(0,0,0,.85), 0 0 16px rgba(0,0,0,.5)";
  }
  function escapeHtml(s){
    return s.replace(/[&<>"]/g, function(m){
      return { "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[m];
    });
  }
  $("cueText").addEventListener("input", function(){
    S.cueRaw = this.value;
    S.cueLines = splitCue(this.value);
    if (S.cueIdx >= S.cueLines.length) S.cueIdx = Math.max(0, S.cueLines.length-1);
    buildCueIndex(); syncPtr();
    renderCue(); save();
  });
  $("cuePrev").onclick = function(){ S.cueIdx = Math.max(0, S.cueIdx-1); syncPtr(); renderCue(); };
  $("cueNext").onclick = function(){ S.cueIdx = Math.min(S.cueLines.length-1, S.cueIdx+1); syncPtr(); renderCue(); };
  $("cueTop").onclick  = function(){ S.cueIdx = 0; syncPtr(); renderCue(); };
  $("cueAuto").onclick = function(){
    S.cueAuto = !S.cueAuto; this.setAttribute("aria-pressed", S.cueAuto); cueHint(); save();
  };
  function cueHint(){
    if (!S.cueAuto){ cueStatus("自动跟读已关。用上下方向键手动翻页。"); return; }
    if (S.lang === "off"){ cueStatus("自动跟读需要语音识别，请把上面的实时转录切到中文或英文。"); return; }
    if (!S.cueLines.length){ cueStatus("先在上面写几句稿子，一行一句。"); return; }
    cueStatus("自动跟读已开。录制时自动生效；想空练就开排练监听。");
  }
  $("cueRehearse").onclick = function(){
    S.cueRehearse = !S.cueRehearse;
    this.setAttribute("aria-pressed", S.cueRehearse);
    if (S.cueRehearse && !S.recording) startRecog(); else if (!S.recording) stopRecog();
    save();
  };
  ["cuePosTop","cuePosMid","cuePosBot"].forEach(function(id,i){
    $(id).onclick = function(){
      S.cuePos = { x:(100 - S.cue.width)/2, y:[4,42,68][i] };
      renderCue(); save();
    };
  });
  $("cueAlignL").onclick = function(){
    S.cueAlign = "left";
    this.setAttribute("aria-pressed","true"); $("cueAlignC").setAttribute("aria-pressed","false");
    renderCue(); save();
  };
  $("cueAlignC").onclick = function(){
    S.cueAlign = "center";
    this.setAttribute("aria-pressed","true"); $("cueAlignL").setAttribute("aria-pressed","false");
    renderCue(); save();
  };
  $("togglePrompt").onclick = function(){
    S.cueOn = !S.cueOn; this.setAttribute("aria-pressed", S.cueOn); renderCue(); save();
  };

  /* 拖动提词条 */
  (function(){
    var drag = null;
    cueEl.addEventListener("pointerdown", function(e){
      drag = { x:e.clientX, y:e.clientY, ox:S.cuePos.x, oy:S.cuePos.y };
      cueEl.classList.add("drag");
      cueEl.setPointerCapture && cueEl.setPointerCapture(e.pointerId);
    });
    window.addEventListener("pointermove", function(e){
      if (!drag) return;
      var r = stage.getBoundingClientRect();
      S.cuePos.x = Math.max(0, Math.min(100 - S.cue.width, drag.ox + (e.clientX-drag.x)/r.width*100));
      S.cuePos.y = Math.max(0, Math.min(96, drag.oy + (e.clientY-drag.y)/r.height*100));
      renderCue();
    });
    window.addEventListener("pointerup", function(){
      if (drag){ drag = null; cueEl.classList.remove("drag"); save(); }
    });
  })();

  /* 跟读匹配
     中文按字对齐没问题，但英文如果也按字母对齐就会失效：
     去掉空格后 the、and 这些词的字母在任何一段英文里都凑得齐，
     相似度虚高，指针就乱跳。所以这里统一按「词」来对齐，
     中文一个字算一个词，英文一个单词算一个词。 */
  function isCJK(t){ return /[\u4e00-\u9fa5]/.test(t); }
  function tokenize(s){
    var out = [], re = /[\u4e00-\u9fa5]|[a-z0-9']+/g, m;
    var str = (s||"").toLowerCase().replace(/[’']/g,"'");
    while ((m = re.exec(str))){
      var t = m[0].replace(/'/g,"");
      if (t) out.push(t);
    }
    return out;
  }
  /* 长词更能说明位置，the、a、is 这种给很低的权重，
     免得一堆虚词把分数顶上去 */
  function tokWeight(t){
    if (isCJK(t)) return 1.2;
    if (t.length <= 2) return 0.35;
    if (t.length === 3) return 0.8;
    return Math.min(3, 0.8 + (t.length-3)*0.4);
  }
  /* 英文识别常把词尾、单复数、时态听错，允许一个字符的出入 */
  function nearEq(a,b){
    if (a === b) return true;
    if (isCJK(a) || isCJK(b)) return false;
    var la = a.length, lb = b.length;
    if (Math.max(la,lb) < 4) return false;
    if (la >= 5 && lb >= 5 && a.slice(0,4) === b.slice(0,4)) return true;
    if (Math.abs(la-lb) > 1) return false;
    var i = 0, j = 0, diff = 0;
    while (i < la && j < lb){
      if (a[i] === b[j]){ i++; j++; continue; }
      if (++diff > 1) return false;
      if (la > lb) i++;
      else if (lb > la) j++;
      else { i++; j++; }
    }
    if (i < la || j < lb) diff++;
    return diff <= 1;
  }
  function wlcs(A,B){
    var n = A.length, m = B.length;
    if (!n || !m) return 0;
    var prev = new Float32Array(m+1), cur = new Float32Array(m+1);
    for (var i=1;i<=n;i++){
      for (var j=1;j<=m;j++){
        cur[j] = nearEq(A[i-1],B[j-1]) ? prev[j-1] + tokWeight(A[i-1])
                                       : Math.max(prev[j], cur[j-1]);
      }
      prev.set(cur); cur.fill(0);
    }
    return prev[m];
  }

  var cueToks = [];
  function buildCueIndex(){
    cueToks = [];
    S.cueLines.forEach(function(l,li){
      tokenize(l).forEach(function(t){ cueToks.push({ t:t, l:li }); });
    });
    S.cuePtr = 0;
  }
  function syncPtr(){
    S.cuePtr = 0;
    for (var i=0;i<cueToks.length;i++){
      if (cueToks[i].l >= S.cueIdx){ S.cuePtr = i; return; }
    }
    S.cuePtr = cueToks.length;
  }
  function cueStatus(txt){ $("cueStat").textContent = txt; }
  function nowMs(){
    if (!S.recording) return 0;
    return S.paused ? S.elapsed : (S.elapsed + (Date.now() - S.startAt));
  }
  /* 录制时记下每句开始讲的时刻，之后直接变成字幕时间轴 */
  function markCue(li){
    var m = S.cueMarks;
    if (m.length && m[m.length-1].i === li) return;
    m.push({ t:nowMs(), i:li });
  }

  function scoreAt(tailToks, totalW, lo, hi, segLen){
    var best = -1, bestScore = 0;
    for (var p = lo + Math.min(2, segLen); p <= hi; p++){
      var from = Math.max(lo, p - segLen);
      var seg = [];
      for (var q = from; q < p; q++) seg.push(cueToks[q].t);
      var sc = wlcs(tailToks, seg) / totalW;
      if (sc > bestScore){ bestScore = sc; best = p; }
    }
    return { p:best, sc:bestScore };
  }

  function advanceCue(){
    if (!S.cueAuto || !cueToks.length) return;
    /* 语音识别给的备选结果也拿来试，英文口音下第二候选经常才是对的 */
    var cands = [S.finalText + S.interimText];
    if (S.altText) cands.push(S.finalText + S.altText);

    var lo = Math.max(0, (S.cuePtr||0) - 3);
    var hi = Math.min(cueToks.length, (S.cuePtr||0) + 45);
    var best = null;
    for (var c=0;c<cands.length;c++){
      var toks = tokenize(cands[c]);
      if (toks.length < 2) continue;
      var tail = toks.slice(-8);
      var totalW = 0;
      tail.forEach(function(t){ totalW += tokWeight(t); });
      if (totalW < 1.2) continue;                 // 全是虚词，等下一批
      var r = scoreAt(tail, totalW, lo, hi, tail.length + 4);
      if (!best || r.sc > best.sc) best = r;
    }
    if (!best) return;

    if (best.p > 0 && best.sc >= 0.45){
      if (best.p > (S.cuePtr||0)) S.cuePtr = best.p;
      var li = cueToks[Math.min(S.cuePtr, cueToks.length-1)].l;
      if (li !== S.cueIdx){ S.cueIdx = li; renderCue(); }
      cueStatus("跟读中：第 " + (S.cueIdx+1) + " 句，匹配 " + Math.round(best.sc*100) + "%");
      if (S.recording) markCue(S.cueIdx);
    } else {
      cueStatus("跟读中：这几个词没对上（" + Math.round(best.sc*100) + "%），继续念或用方向键手动翻。");
    }
  }

  /* ================== 人脸关键点 ================== */
  var faceLandmarker = null;
  function setFaceStatus(state,msg){
    S.faceState = state;
    var el = $("faceStatus");
    el.className = "status" + (state==="ok"?" ok":(state==="fail"?" bad":""));
    el.textContent = msg;
  }
  setFaceStatus("loading","面部追踪：正在加载模型");
  import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14")
    .then(function(v){
      return v.FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm")
        .then(function(fs){
          return v.FaceLandmarker.createFromOptions(fs, {
            baseOptions:{
              modelAssetPath:"https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate:"GPU"
            },
            runningMode:"VIDEO", numFaces:1
          });
        });
    })
    .then(function(f){ faceLandmarker = f; setFaceStatus("idle","面部追踪：已就绪，等画面开启"); })
    .catch(function(){ setFaceStatus("fail","面部追踪：模型没能加载（需要联网）。五官微调不可用，面部修饰退回整幅处理。"); });

  function detectFace(){
    if (!faceLandmarker || !S.faceOn || !preview.videoWidth){ if(!S.faceOn){ S.lm=null; S.sm=null; } return; }
    var now = performance.now();
    if (now - S.lmAt < 28) return;
    S.lmAt = now;
    try {
      var res = faceLandmarker.detectForVideo(preview, now);
      var raw = (res && res.faceLandmarks && res.faceLandmarks.length) ? res.faceLandmarks[0] : null;
      if (!raw){ S.lm = null; S.sm = null; return; }
      if (!S.sm || S.sm.length !== raw.length){
        S.sm = raw.map(function(p){ return {x:p.x,y:p.y}; });
      } else {
        for (var i=0;i<raw.length;i++){
          S.sm[i].x += (raw[i].x - S.sm[i].x)*0.5;
          S.sm[i].y += (raw[i].y - S.sm[i].y)*0.5;
        }
      }
      S.lm = S.sm;
    } catch(e){ S.lm = null; }
  }

  /* ================== WebGL 几何变形 ================== */
  var gl=null, glProg=null, glTex=null, glU={};
  var VS = "attribute vec2 p;varying vec2 vUv;void main(){vUv=p*0.5+0.5;gl_Position=vec4(p,0.0,1.0);}";
  var FS = [
    "precision highp float;varying vec2 vUv;uniform sampler2D uTex;",
    "uniform float uAspect,uFlip,uRBrow,uABrow;",
    "uniform vec2 uEyeL,uEyeR,uNose,uMouth,uInL,uInR,uBrowL,uBrowR;",
    "uniform vec4 uR,uA;",
    "uniform vec4 uSlim;",    // eyeY, mouthY, chinY, amount
    "uniform vec4 uChinP;",   // cx, mouthY, chinY, amount
    "uniform vec2 uYr;",      // 轮廓采样的 y 范围
    "uniform float uCx[16];", // 每一层的脸中轴
    "uniform float uHw[16];", // 每一层的半宽
    "vec2 contour(float y){",
    " float t=clamp((y-uYr.x)/max(1e-5,uYr.y-uYr.x),0.0,1.0)*15.0;",
    " vec2 r=vec2(uCx[15],uHw[15]);",
    " for(int i=0;i<15;i++){",
    "  if(float(i)<=t && t<float(i+1)){",
    "   float f=t-float(i);",
    "   r=vec2(mix(uCx[i],uCx[i+1],f), mix(uHw[i],uHw[i+1],f));",
    "  }}",
    " return r;}",
    "vec2 sc(vec2 uv,vec2 c,float r,float a){",
    " if(a==0.0||r<=0.0) return uv;",
    " vec2 d=(uv-c)*vec2(uAspect,1.0);float dist=length(d);",
    " if(dist>=r) return uv;",
    " float t=1.0-dist/r;return c+(uv-c)*(1.0-a*t*t);}",
    "vec2 ps(vec2 uv,vec2 c,vec2 dir,float r,float a){",
    " if(a==0.0||r<=0.0) return uv;",
    " vec2 d=(uv-c)*vec2(uAspect,1.0);float dist=length(d);",
    " if(dist>=r) return uv;",
    " float t=1.0-dist/r;return uv+dir*a*t*t;}",
    /* 瘦脸：位移峰值正好落在当前高度的轮廓线上，脸中间和轮廓外都是零 */
    "vec2 slim(vec2 uv){",
    " float a=uSlim.w; if(a==0.0) return uv;",
    " vec2 ch=contour(uv.y); float cx=ch.x, hw=ch.y;",
    " if(hw<=1e-5) return uv;",
    " float wy=smoothstep(uSlim.x,uSlim.y,uv.y)*(1.0-smoothstep(uSlim.z,uSlim.z+(uSlim.z-uSlim.y)*0.75,uv.y));",
    " if(wy<=0.0) return uv;",
    " float s=(uv.x-cx)/hw; float ad=abs(s);",
    " float wx=smoothstep(0.30,0.95,ad)*(1.0-smoothstep(1.0,1.32,ad));",
    " if(wx<=0.0) return uv;",
    " float dir=(s>=0.0)?1.0:-1.0;",
    " return vec2(uv.x+dir*a*hw*wx*wy, uv.y);}",
    /* 下巴：嘴以下垂直收短，横向只在脸宽内 */
    "vec2 shortChin(vec2 uv){",
    " float a=uChinP.w; if(a==0.0) return uv;",
    " vec2 ch=contour(uv.y); float hw=ch.y;",
    " if(hw<=1e-5) return uv;",
    " float my=uChinP.y, cy=uChinP.z, h=max(1e-4,cy-my);",
    " float wy=smoothstep(my,my+h*0.5,uv.y)*(1.0-smoothstep(cy+h*0.15,cy+h*0.7,uv.y));",
    " float wx=1.0-smoothstep(0.5,1.1,abs(uv.x-ch.x)/hw);",
    " float k=1.0+a*wy*wx;",
    " return vec2(uv.x, my+(uv.y-my)*k);}",
    "void main(){",
    " vec2 uv=vec2(vUv.x,1.0-vUv.y);",
    " if(uFlip>0.5) uv.x=1.0-uv.x;",
    " uv=slim(uv); uv=shortChin(uv);",
    " uv=sc(uv,uEyeL,uR.x,uA.x); uv=sc(uv,uEyeR,uR.x,uA.x);",
    " uv=sc(uv,uNose,uR.y,uA.y); uv=sc(uv,uMouth,uR.z,uA.z);",
    " uv=ps(uv,uBrowL,uInL,uRBrow,uABrow); uv=ps(uv,uBrowR,uInR,uRBrow,uABrow);",
    " gl_FragColor=texture2D(uTex,clamp(uv,0.001,0.999));}"
  ].join("\n");

  function initGL(){
    try {
      gl = glc.getContext("webgl", { preserveDrawingBuffer:true, alpha:false });
      if (!gl) return false;
      function sh(t,src){
        var s = gl.createShader(t); gl.shaderSource(s,src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error("shader");
        return s;
      }
      glProg = gl.createProgram();
      gl.attachShader(glProg, sh(gl.VERTEX_SHADER, VS));
      gl.attachShader(glProg, sh(gl.FRAGMENT_SHADER, FS));
      gl.linkProgram(glProg);
      if (!gl.getProgramParameter(glProg, gl.LINK_STATUS)) throw new Error("link");
      gl.useProgram(glProg);
      var buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(glProg,"p");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
      glTex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, glTex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      ["uTex","uAspect","uFlip","uEyeL","uEyeR","uNose","uMouth",
       "uInL","uInR","uBrowL","uBrowR","uR","uA","uSlim","uChinP","uYr","uRBrow","uABrow"]
        .forEach(function(n){ glU[n] = gl.getUniformLocation(glProg,n); });
      glU.uCx = gl.getUniformLocation(glProg,"uCx[0]");
      glU.uHw = gl.getUniformLocation(glProg,"uHw[0]");
      return true;
    } catch(e){ gl = null; return false; }
  }
  var GL_OK = null;
  function Rw(i){ return S.lm[i]; }
  function distA(a,b,aspect){ return Math.hypot((a.x-b.x)*aspect, a.y-b.y); }

  /* 把脸的外轮廓按高度切成 16 层，每层量出中轴和半宽，
     这样形变的峰值能落在真正的下颌线上，而不是一个想当然的圆 */
  var cxArr = new Float32Array(16), hwArr = new Float32Array(16);
  function faceContour(){
    var pts = IDX.oval.map(function(i){ return Rw(i); });
    var y0 = 1, y1 = 0, i;
    for (i=0;i<pts.length;i++){ if (pts[i].y < y0) y0 = pts[i].y; if (pts[i].y > y1) y1 = pts[i].y; }
    var span = Math.max(1e-5, y1 - y0);
    for (var s=0;s<16;s++){
      var y = y0 + span * (s/15);
      var lo = 1e9, hi = -1e9;
      for (i=0;i<pts.length;i++){
        var a = pts[i], b = pts[(i+1)%pts.length];
        if ((a.y <= y && b.y >= y) || (b.y <= y && a.y >= y)){
          var d = (b.y - a.y);
          var t = Math.abs(d) < 1e-9 ? 0 : (y - a.y)/d;
          var x = a.x + (b.x - a.x)*t;
          if (x < lo) lo = x;
          if (x > hi) hi = x;
        }
      }
      if (hi < lo){ cxArr[s] = s ? cxArr[s-1] : 0.5; hwArr[s] = s ? hwArr[s-1] : 0; }
      else { cxArr[s] = (lo+hi)/2; hwArr[s] = (hi-lo)/2; }
    }
    return { y0:y0, y1:y1, cx:cxArr, hw:hwArr };
  }

  function renderWarp(W,H){
    if (GL_OK === null) GL_OK = initGL();
    if (!GL_OK) return null;
    if (glc.width !== W || glc.height !== H){ glc.width = W; glc.height = H; }
    gl.viewport(0,0,W,H);
    gl.bindTexture(gl.TEXTURE_2D, glTex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, preview); }
    catch(e){ return null; }
    gl.uniform1i(glU.uTex, 0);
    var aspect = W/H;
    gl.uniform1f(glU.uAspect, aspect);
    gl.uniform1f(glU.uFlip, S.flip ? 1 : 0);

    var w = S.warp, has = S.lm && S.faceOn;
    var zero = [0,0,0,0];
    if (!has || (!w.eye && !w.nose && !w.mouth && !w.slim && !w.chin && !w.brow)){
      ["uEyeL","uEyeR","uNose","uMouth","uInL","uInR","uBrowL","uBrowR"]
        .forEach(function(n){ gl.uniform2f(glU[n],0,0); });
      gl.uniform4fv(glU.uR, zero); gl.uniform4fv(glU.uA, zero);
      gl.uniform4fv(glU.uSlim, zero); gl.uniform4fv(glU.uChinP, zero);
      gl.uniform2f(glU.uYr, 0, 1);
      gl.uniform1fv(glU.uCx, cxArr); gl.uniform1fv(glU.uHw, hwArr);
      gl.uniform1f(glU.uRBrow,0); gl.uniform1f(glU.uABrow,0);
    } else {
      function C(list){
        var sx=0, sy=0;
        list.forEach(function(i){ sx += Rw(i).x; sy += Rw(i).y; });
        return { x:sx/list.length, y:sy/list.length };
      }
      var eL = C(IDX.eyeL), eR = C(IDX.eyeR);
      var nose = Rw(IDX.noseTip), mouth = Rw(IDX.mouthC), chin = Rw(IDX.chin);
      var chL = Rw(IDX.cheekL), chR = Rw(IDX.cheekR);
      var faceW = distA(chL, chR, aspect);
      var faceH = Math.abs(chin.y - Rw(IDX.top).y);
      var eyeW  = distA(Rw(33), Rw(133), aspect);
      var noseW = distA(Rw(IDX.noseL), Rw(IDX.noseR), aspect);
      var mouthW= distA(Rw(IDX.mouthL), Rw(IDX.mouthR), aspect);

      gl.uniform2f(glU.uEyeL, eL.x, eL.y);
      gl.uniform2f(glU.uEyeR, eR.x, eR.y);
      gl.uniform2f(glU.uNose, nose.x, nose.y);
      gl.uniform2f(glU.uMouth, mouth.x, mouth.y);

      var outL = (chL.x < nose.x) ? -1 : 1;
      gl.uniform2f(glU.uInL, -outL, 0);
      gl.uniform2f(glU.uInR, outL, 0);
      var bL = Rw(IDX.eyeOutL), bR = Rw(IDX.eyeOutR);
      gl.uniform2f(glU.uBrowL, bL.x, bL.y);
      gl.uniform2f(glU.uBrowR, bR.x, bR.y);

      gl.uniform4fv(glU.uR, [eyeW*1.75, noseW*1.35, mouthW*0.95, 0]);
      gl.uniform4fv(glU.uA, [w.eye*0.26, -w.nose*0.24, w.mouth*0.20, 0]);
      gl.uniform1f(glU.uRBrow, eyeW*0.85);
      gl.uniform1f(glU.uABrow, w.brow*eyeW*0.08);

      var c = faceContour();
      gl.uniform2f(glU.uYr, c.y0, c.y1);
      gl.uniform1fv(glU.uCx, c.cx);
      gl.uniform1fv(glU.uHw, c.hw);

      var eyeY = (eL.y + eR.y)/2;
      var mouthLo = Rw(17).y;
      gl.uniform4fv(glU.uSlim, [eyeY, mouthLo, chin.y, w.slim*0.13]);
      gl.uniform4fv(glU.uChinP, [mouth.x, mouthLo, chin.y, w.chin*0.14]);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    return glc;
  }

  /* ================== 纹路曲线 ================== */
  var hw = 0, hh = 0;
  function P(i){
    var l = S.lm[i];
    return { x:(S.flip ? (1-l.x) : l.x)*hw, y:l.y*hh };
  }
  function toMask(n){ return { x:(S.flip ? (1-n.x) : n.x)*hw, y:n.y*hh }; }
  function faceNormH(){
    if (!S.lm) return .3;
    return Math.abs(S.lm[IDX.chin].y - S.lm[IDX.top].y) || .3;
  }
  /* 返回归一化（未翻转）空间的 A、B、中点、宽度 */
  function anchors(key){
    if (!S.lm) return null;
    var g = S.rgn[key], fs = faceNormH(), asp = (hw/hh) || 1.33;
    var ux = fs/asp, uy = fs;                 // 屏幕等距的一个“脸长单位”
    var A, B, M, w0;
    if (key === "troughL" || key === "troughR"){
      var L = (key === "troughL");
      var inner = Rw(L?IDX.eyeInL:IDX.eyeInR), outer = Rw(L?IDX.eyeOutL:IDX.eyeOutR);
      var lidM  = Rw(L?IDX.lidMidL:IDX.lidMidR), up = Rw(L?IDX.lidUpL:IDX.lidUpR);
      var eh = Math.max(0.004, Math.abs(lidM.y - up.y));
      A = { x:inner.x, y:inner.y + eh*0.95 };
      B = { x:outer.x, y:outer.y + eh*1.15 };
      M = { x:lidM.x,  y:lidM.y  + eh*1.25 };
      w0 = eh*1.6;
    } else {
      var Lf = (key === "foldL");
      var nw = Rw(Lf?IDX.noseL:IDX.noseR), mc2 = Rw(Lf?IDX.mouthL:IDX.mouthR);
      var nt = Rw(IDX.noseTip);
      var out = (nw.x < nt.x) ? -1 : 1;
      A = { x:nw.x + out*ux*0.02,  y:nw.y + uy*0.015 };
      B = { x:mc2.x + out*ux*0.045, y:mc2.y + uy*0.055 };
      M = { x:(A.x+B.x)/2 + out*ux*0.035, y:(A.y+B.y)/2 };
      w0 = uy*0.05;
    }
    A = { x:A.x + g.ax*ux, y:A.y + g.ay*uy };
    B = { x:B.x + g.bx*ux, y:B.y + g.by*uy };
    var mdx = (g.ax+g.bx)/2, mdy = (g.ay+g.by)/2;
    M = { x:M.x + mdx*ux, y:M.y + mdy*uy };
    return { A:A, B:B, M:M, w:w0*g.w };
  }
  function strokeRgn(c, key, extraBlur){
    var a = anchors(key);
    if (!a) return null;
    var A = toMask(a.A), B = toMask(a.B), M = toMask(a.M);
    var C = { x:2*M.x - (A.x+B.x)/2, y:2*M.y - (A.y+B.y)/2 };
    c.lineCap = "round"; c.lineJoin = "round";
    c.lineWidth = a.w * hh;
    c.beginPath(); c.moveTo(A.x, A.y); c.quadraticCurveTo(C.x, C.y, B.x, B.y); c.stroke();
    return { A:A, B:B, M:M, C:C, w:a.w*hh };
  }
  function clearMask(){
    kx.setTransform(1,0,0,1,0,0);
    kx.globalCompositeOperation = "source-over";
    kx.globalAlpha = 1;
    kx.clearRect(0,0,hw,hh);
    kx.fillStyle = "#fff"; kx.strokeStyle = "#fff";
  }
  function blurOn(c,px){ if (FILTER_OK) c.filter = "blur(" + Math.max(0.5,px) + "px)"; }
  function blurOff(c){ if (FILTER_OK) c.filter = "none"; }

  function maskOne(key,f,offX,offY){
    clearMask(); blurOn(kx,f);
    kx.save();
    if (offX || offY) kx.translate(offX||0, offY||0);
    strokeRgn(kx,key);
    kx.restore();
    blurOff(kx);
  }

  /* 低分辨率亮度图，用来找纹路真正的位置 */
  var lumC = mkc(), lumX = lumC.getContext("2d",{ willReadFrequently:true });
  var lumData = null, lumW = 0, lumH = 0;
  function sampleLum(){
    lumW = 160; lumH = Math.max(2, Math.round(160*cv.height/cv.width));
    if (lumC.width !== lumW || lumC.height !== lumH){ lumC.width = lumW; lumC.height = lumH; }
    lumX.setTransform(1,0,0,1,0,0);
    lumX.drawImage(cv,0,0,lumW,lumH);
    lumData = lumX.getImageData(0,0,lumW,lumH).data;
  }
  function lumAt(nx,ny){
    if (!lumData) return 255;
    var x = Math.round(nx*(lumW-1)), y = Math.round(ny*(lumH-1));
    if (x < 0 || y < 0 || x >= lumW || y >= lumH) return 255;
    var i = (y*lumW+x)*4;
    return lumData[i]*0.299 + lumData[i+1]*0.587 + lumData[i+2]*0.114;
  }
  /* 沿法线搜索最暗的一条线，把遮罩吸附到真实的凹陷上 */
  var snapCache = { troughL:0, troughR:0, foldL:0, foldR:0 };
  function snapRegion(key){
    var a = anchors(key);
    if (!a) return 0;
    var A = toMask(a.A), B = toMask(a.B), M = toMask(a.M);
    var C = { x:2*M.x-(A.x+B.x)/2, y:2*M.y-(A.y+B.y)/2 };
    var dx = B.x-A.x, dy = B.y-A.y, len = Math.hypot(dx,dy) || 1;
    var nx = -dy/len, ny = dx/len, wpx = a.w*hh;
    var sum = 0, cnt = 0;
    for (var s=1;s<=5;s++){
      var t = s/6, mt = 1-t;
      var px = mt*mt*A.x + 2*mt*t*C.x + t*t*B.x;
      var py = mt*mt*A.y + 2*mt*t*C.y + t*t*B.y;
      var bestOff = 0, bestL = 1e9;
      for (var k=-6;k<=6;k++){
        var off = (k/6)*wpx*0.85;
        var l = lumAt((px+nx*off)/hw, (py+ny*off)/hh);
        if (l < bestL){ bestL = l; bestOff = off; }
      }
      sum += bestOff; cnt++;
    }
    var raw = cnt ? sum/cnt : 0;
    snapCache[key] += (raw - snapCache[key]) * 0.15;
    return snapCache[key];
  }
  /* 用大半径模糊得到这块皮肤本该有的亮度，再用变亮把凹陷填到那个水平。
     模糊半径必须比纹路本身宽，否则模糊里还是那道暗线，变亮就等于什么都没做。 */
  /* 只让「比皮肤暗一点」的像素参与填充。睫毛、鼻孔、唇线、眉毛比皮肤暗得多，
     被排除在外，所以它们不会被亮层洗掉，也就不会看起来发糊。 */
  var pmS = mkc(), pmSx = pmS.getContext("2d"), pmImg = null;
  function skinLum(){
    var pts = [50, 280, 117, 346, 205, 425];
    var sum = 0, n = 0;
    for (var i=0;i<pts.length;i++){
      var p = P(pts[i]);
      var l = lumAt(p.x/hw, p.y/hh);
      if (l < 250){ sum += l; n++; }
    }
    return n ? sum/n : 150;
  }
  function buildProtect(){
    if (!lumData) return null;
    if (pmS.width !== lumW || pmS.height !== lumH){
      pmS.width = lumW; pmS.height = lumH; pmImg = null;
    }
    if (!pmImg || pmImg.width !== lumW) pmImg = pmSx.createImageData(lumW, lumH);
    var T = skinLum() * 0.55;
    var lo = T * 0.72, span = Math.max(6, T * 0.5);
    var d = pmImg.data;
    for (var i=0, n=lumW*lumH; i<n; i++){
      var l = lumData[i*4]*0.299 + lumData[i*4+1]*0.587 + lumData[i*4+2]*0.114;
      var a = (l - lo) / span;
      a = a < 0 ? 0 : (a > 1 ? 1 : a);
      var o = i*4;
      d[o] = d[o+1] = d[o+2] = 255;
      d[o+3] = Math.round(a*255);
    }
    pmSx.putImageData(pmImg, 0, 0);
    return pmS;
  }
  function protectFeatures(f){
    kx.globalCompositeOperation = "destination-out";
    blurOn(kx, Math.max(1.5, f*0.7));
    poly(kx, IDX.eyeL, 1.18); kx.fill();
    poly(kx, IDX.eyeR, 1.18); kx.fill();
    poly(kx, IDX.browL, 1.25); kx.fill();
    poly(kx, IDX.browR, 1.25); kx.fill();
    poly(kx, IDX.lips, 1.12); kx.fill();
    blurOff(kx);
    kx.globalCompositeOperation = "source-over";
  }
  var clC = mkc(), clX = clC.getContext("2d");
  var ivC = mkc(), ivX = ivC.getContext("2d");
  function skinRGB(){
    var pts = [50, 280, 205, 425];
    var r=0,g=0,b=0,n=0;
    for (var i=0;i<pts.length;i++){
      var p = P(pts[i]);
      var x = Math.round(p.x/hw*(lumW-1)), y = Math.round(p.y/hh*(lumH-1));
      if (x<0||y<0||x>=lumW||y>=lumH) continue;
      var o = (y*lumW+x)*4;
      r += lumData[o]; g += lumData[o+1]; b += lumData[o+2]; n++;
    }
    if (!n) return "rgb(190,160,150)";
    return "rgb(" + Math.round(r/n) + "," + Math.round(g/n) + "," + Math.round(b/n) + ")";
  }
  function creaseFill(keys,W,H,strength){
    if (strength <= 0) return;
    sampleLum();
    var pm = buildProtect();
    var ws = [];
    keys.forEach(function(k){ var a = anchors(k); if (a) ws.push(a.w*hh); });
    if (!ws.length) return;
    var wpx = 0;
    ws.forEach(function(v){ wpx += v; });
    wpx /= ws.length;

    [clC,ivC].forEach(function(c){ if (c.width!==hw||c.height!==hh){ c.width=hw; c.height=hh; } });
    /* 参考层：先把睫毛鼻孔唇线这些远比皮肤暗的地方用平均肤色盖掉，
       再做大半径模糊。这样模糊结果代表「这块皮肤本该多亮」，
       而不是把那道暗线一起糊进去，凹陷才真的被抬起来。 */
    if (pm){
      ivX.setTransform(1,0,0,1,0,0);
      ivX.globalCompositeOperation = "source-over";
      ivX.clearRect(0,0,hw,hh);
      ivX.fillStyle = skinRGB();
      ivX.fillRect(0,0,hw,hh);
      ivX.globalCompositeOperation = "destination-out";
      ivX.drawImage(pm,0,0,hw,hh);
      ivX.globalCompositeOperation = "source-over";
    }
    clX.setTransform(1,0,0,1,0,0);
    clX.globalCompositeOperation = "source-over";
    clX.clearRect(0,0,hw,hh);
    clX.drawImage(cv,0,0,hw,hh);
    if (pm) clX.drawImage(ivC,0,0);

    bx.setTransform(1,0,0,1,0,0);
    bx.filter = "blur(" + Math.max(5, wpx*0.8) + "px)";
    bx.clearRect(0,0,hw,hh);
    bx.drawImage(clC,0,0);
    bx.filter = "none";

    keys.forEach(function(k){
      var a = anchors(k);
      if (!a) return;
      var A = toMask(a.A), B = toMask(a.B);
      var dx = B.x-A.x, dy = B.y-A.y, len = Math.hypot(dx,dy) || 1;
      var nx = -dy/len, ny = dx/len;
      var off = snapRegion(k);
      var fe = Math.max(2, wpx*0.26);
      maskOne(k, fe, nx*off, ny*off);
      protectFeatures(fe);
      if (pm){
        kx.globalCompositeOperation = "destination-in";
        kx.drawImage(pm, 0, 0, hw, hh);
        kx.globalCompositeOperation = "source-over";
      }
      applyMasked(bc, W, H, "lighten", Math.min(.95, strength));
    });
  }
  function poly(c, idxs, scale){
    var cx=0, cy=0;
    var pts = idxs.map(function(i){ var p=P(i); cx+=p.x; cy+=p.y; return p; });
    cx/=pts.length; cy/=pts.length;
    c.beginPath();
    pts.forEach(function(p,i){
      var x = cx+(p.x-cx)*(scale||1), y = cy+(p.y-cy)*(scale||1);
      if(i===0) c.moveTo(x,y); else c.lineTo(x,y);
    });
    c.closePath();
  }
  function maskSkin(f){
    clearMask(); blurOn(kx,f);
    poly(kx, IDX.oval, S.skin.range); kx.fill();
    kx.globalCompositeOperation = "destination-out";
    blurOn(kx, f*0.55);
    poly(kx, IDX.eyeL, 1.3); kx.fill();
    poly(kx, IDX.eyeR, 1.3); kx.fill();
    poly(kx, IDX.browL, 1.4); kx.fill();
    poly(kx, IDX.browR, 1.4); kx.fill();
    poly(kx, IDX.lips, 1.2); kx.fill();
    blurOff(kx);
    kx.globalCompositeOperation = "source-over";
  }
  function maskEyes(f){
    clearMask(); blurOn(kx, Math.max(1.2,f*0.3));
    poly(kx, IDX.eyeL, 1.02); kx.fill();
    poly(kx, IDX.eyeR, 1.02); kx.fill();
    blurOff(kx);
  }
  function maskLips(f){
    clearMask(); blurOn(kx, Math.max(1.2,f*0.35));
    poly(kx, IDX.lips, 1.0); kx.fill(); blurOff(kx);
  }
  function maskTeeth(f){
    clearMask(); blurOn(kx, Math.max(1.2,f*0.3));
    poly(kx, IDX.mouthIn, 0.95); kx.fill(); blurOff(kx);
  }
  function maskFaceWhole(f){
    clearMask(); blurOn(kx,f);
    poly(kx, IDX.oval, Math.max(1.05, S.skin.range)); kx.fill(); blurOff(kx);
  }

  function applyMasked(src,W,H,mode,alpha){
    if (alpha <= 0) return;
    tx.setTransform(1,0,0,1,0,0);
    tx.globalCompositeOperation = "source-over"; tx.globalAlpha = 1;
    tx.clearRect(0,0,hw,hh);
    tx.drawImage(src,0,0,hw,hh);
    tx.globalCompositeOperation = "destination-in";
    tx.drawImage(mk,0,0);
    tx.globalCompositeOperation = "source-over";
    ctx.globalCompositeOperation = mode;
    ctx.globalAlpha = Math.min(1,alpha);
    ctx.drawImage(tp,0,0,W,H);
    ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
  }
  function fillMasked(W,H,color,mode,alpha){
    if (alpha <= 0) return;
    tx.setTransform(1,0,0,1,0,0);
    tx.globalCompositeOperation = "source-over"; tx.globalAlpha = 1;
    tx.clearRect(0,0,hw,hh);
    tx.fillStyle = color; tx.fillRect(0,0,hw,hh);
    tx.globalCompositeOperation = "destination-in";
    tx.drawImage(mk,0,0);
    tx.globalCompositeOperation = "source-over";
    ctx.globalCompositeOperation = mode;
    ctx.globalAlpha = Math.min(1,alpha);
    ctx.drawImage(tp,0,0,W,H);
    ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
  }
  function ensureWork(W,H){
    hw = Math.max(220, Math.round(W/2)); hh = Math.round(hw*H/W);
    [bc,mk,tp,og].forEach(function(c){ if (c.width!==hw||c.height!==hh){ c.width=hw; c.height=hh; } });
  }

  function retouch(W,H){
    var s = S.skin;
    var any = s.trough||s.fold||s.eyeLight||s.lipBoost||s.teeth||s.smooth||s.even||s.warm||s.lift||s.glow;
    if (!any || !FILTER_OK) return;
    ensureWork(W,H);
    ox.setTransform(1,0,0,1,0,0); ox.clearRect(0,0,hw,hh);
    ox.drawImage(cv,0,0,hw,hh);
    var base = Math.max(3, hw*0.013);
    var f = base * s.feather * 1.5;
    function blurTo(r){
      bx.setTransform(1,0,0,1,0,0);
      bx.filter = "blur(" + r + "px)";
      bx.clearRect(0,0,hw,hh);
      bx.drawImage(cv,0,0,hw,hh);
      bx.filter = "none";
    }
    if (S.lm && S.faceOn){
      if (s.trough > 0) creaseFill(["troughL","troughR"],W,H,s.trough);
      if (s.fold   > 0) creaseFill(["foldL","foldR"],W,H,s.fold);
      blurTo(base);
      maskSkin(f);
      if (s.smooth > 0) applyMasked(bc,W,H,"source-over", s.smooth*0.8);
      if (s.detail > 0 && s.smooth > 0) applyMasked(og,W,H,"source-over", s.detail*0.5*s.smooth);
      if (s.even > 0){ blurTo(base*3); applyMasked(bc,W,H,"color", s.even*0.7); blurTo(base); }
      if (s.glow > 0) applyMasked(bc,W,H,"screen", s.glow*0.3);
      if (s.warm > 0) fillMasked(W,H,"#FFB07A","soft-light", s.warm*0.55);
      if (s.lift > 0){
        var lv = Math.round(s.lift*52);
        fillMasked(W,H,"rgb("+lv+","+lv+","+lv+")","lighten",1);
      }
      if (s.eyeLight > 0){ maskEyes(f); fillMasked(W,H,"#FFFFFF","soft-light", s.eyeLight*0.6); }
      if (s.lipBoost > 0){ maskLips(f); fillMasked(W,H,"#E2564F","soft-light", s.lipBoost*0.55); }
      if (s.teeth > 0){ maskTeeth(f); fillMasked(W,H,"#FFF6EC","soft-light", s.teeth*0.7); }
    } else {
      blurTo(base);
      if (s.smooth > 0){ ctx.globalAlpha = s.smooth*0.45; ctx.drawImage(bc,0,0,W,H); ctx.globalAlpha = 1; }
      if (s.warm > 0){
        ctx.globalCompositeOperation = "soft-light"; ctx.globalAlpha = s.warm*0.4;
        ctx.fillStyle = "#FFB07A"; ctx.fillRect(0,0,W,H);
        ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      }
    }
  }

  function bloom(W,H,amount){
    if (amount <= 0 || !FILTER_OK) return;
    var bw = Math.max(160, Math.round(W/3)), bh = Math.round(bw*H/W);
    if (bl.width !== bw || bl.height !== bh){ bl.width = bw; bl.height = bh; }
    lx.setTransform(1,0,0,1,0,0);
    lx.filter = "blur(" + Math.max(3, bw*0.028) + "px) brightness(1.35) contrast(1.7) saturate(1.1)";
    lx.clearRect(0,0,bw,bh);
    lx.drawImage(cv,0,0,bw,bh);
    lx.filter = "none";
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = Math.min(.8, amount*0.75);
    ctx.drawImage(bl,0,0,W,H);
    ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
  }

  /* ================== 马赛克 ================== */
  function mosaicInto(t,W,H){
    var style = S.mo, m = S.moP;
    var cell = Math.max(4, Math.round(m.cell*W/900));
    var pw = Math.max(2, Math.round(W/cell)), ph = Math.max(2, Math.round(H/cell));
    if (style === "hbar") pw = Math.max(2, Math.round(pw*2.2));
    if (style === "vbar") ph = Math.max(2, Math.round(ph*2.2));
    if (mc.width !== pw || mc.height !== ph){ mc.width = pw; mc.height = ph; }
    sx2.imageSmoothingEnabled = true;
    sx2.drawImage(cv,0,0,pw,ph);
    t.setTransform(1,0,0,1,0,0);
    t.globalAlpha = 1; t.globalCompositeOperation = "source-over";
    t.clearRect(0,0,W,H);
    if (style === "block"){
      t.imageSmoothingEnabled = false;
      t.drawImage(mc,0,0,W,H);
      t.imageSmoothingEnabled = true;
      return;
    }
    var d = sx2.getImageData(0,0,pw,ph).data;
    var cw = W/pw, chh = H/ph, bg = Math.round(m.bg*255), gap = m.gap;
    t.fillStyle = "rgb("+bg+","+bg+","+bg+")"; t.fillRect(0,0,W,H);
    for (var y=0;y<ph;y++){
      for (var x=0;x<pw;x++){
        var i=(y*pw+x)*4, r=d[i], g=d[i+1], b=d[i+2];
        var lum=(r*.299+g*.587+b*.114)/255;
        var px=x*cw, py=y*chh, iw=cw*(1-gap), ih=chh*(1-gap);
        var oX=px+(cw-iw)/2, oY=py+(chh-ih)/2;
        t.fillStyle="rgb("+r+","+g+","+b+")";
        if (style==="dot"){ t.beginPath(); t.arc(px+cw/2,py+chh/2,Math.min(iw,ih)/2,0,6.2832); t.fill(); }
        else if (style==="ring"){
          t.strokeStyle="rgb("+r+","+g+","+b+")";
          t.lineWidth=Math.max(1,Math.min(cw,chh)*0.18);
          t.beginPath(); t.arc(px+cw/2,py+chh/2,Math.min(iw,ih)/2,0,6.2832); t.stroke();
        }
        else if (style==="half"){
          t.beginPath();
          t.arc(px+cw/2,py+chh/2,Math.min(cw,chh)/2*(0.25+lum*0.95)*(1-gap*0.5),0,6.2832); t.fill();
        }
        else if (style==="diamond"){
          t.beginPath(); t.moveTo(px+cw/2,oY); t.lineTo(oX+iw,py+chh/2);
          t.lineTo(px+cw/2,oY+ih); t.lineTo(oX,py+chh/2); t.closePath(); t.fill();
        }
        else if (style==="cross"){
          var th=Math.min(iw,ih)*0.34;
          t.fillRect(px+cw/2-th/2,oY,th,ih);
          t.fillRect(oX,py+chh/2-th/2,iw,th);
        }
        else if (style==="ascii"){
          t.font=Math.round(chh*1.15)+"px monospace";
          t.textAlign="center"; t.textBaseline="middle";
          t.fillText(ASCII[Math.min(ASCII.length-1,Math.round(lum*(ASCII.length-1)))],px+cw/2,py+chh/2);
        }
        else { t.fillRect(oX,oY,iw,ih); }
      }
    }
  }
  function mosaic(W,H){
    if (S.mo === "off") return;
    if (mo2.width !== W || mo2.height !== H){ mo2.width = W; mo2.height = H; }
    mosaicInto(m2x,W,H);
    if (S.moP.faceOnly >= 1 && S.lm && S.faceOn){
      ensureWork(W,H);
      maskFaceWhole(Math.max(3, hw*0.022));
      m2x.globalCompositeOperation = "destination-in";
      m2x.drawImage(mk,0,0,W,H);
      m2x.globalCompositeOperation = "source-over";
    }
    ctx.globalAlpha = S.moP.amount;
    ctx.drawImage(mo2,0,0,W,H);
    ctx.globalAlpha = 1;
  }

  /* ================== 主循环 ================== */
  function vignette(w,h,strength,cold,warm){
    var key = w+"x"+h+":"+strength+":"+(cold||0)+":"+(warm||0);
    if (key === vigKey && vigCache) return vigCache;
    var g = ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*0.25,w/2,h/2,Math.max(w,h)*0.72);
    g.addColorStop(0,"rgba(0,0,0,0)");
    g.addColorStop(1, warm?"rgba(50,18,0,"+strength+")":cold?"rgba(0,8,32,"+strength+")":"rgba(0,0,0,"+strength+")");
    vigCache = g; vigKey = key;
    return g;
  }
  function drawFrame(){
    S.raf = requestAnimationFrame(drawFrame);
    if (!S.stream || !preview.videoWidth) return;
    meter(); S.frame++;
    detectFace(); updateFaceOsd();

    var vw = preview.videoWidth, vh = preview.videoHeight;
    var W = Math.min(1280, vw), H = Math.round(W*vh/vw);
    if (cv.width !== W || cv.height !== H){
      cv.width = W; cv.height = H; vigKey = "";
      stage.style.aspectRatio = W + " / " + H;
      renderCue();
    }
    var def = PRESETS[S.fx], p = cur();
    var src = renderWarp(W,H);

    ctx.setTransform(1,0,0,1,0,0);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    if (FILTER_OK){
      ctx.filter = "brightness("+p.bri+") contrast("+p.con+") saturate("+p.sat+
                   ") hue-rotate("+p.hue+"deg) sepia("+p.sep+") grayscale("+p.gry+
                   ") blur("+p.blr+"px)";
    }
    if (src){ ctx.drawImage(src,0,0,W,H); }
    else {
      ctx.save();
      if (S.flip){ ctx.translate(W,0); ctx.scale(-1,1); }
      ctx.drawImage(preview,0,0,W,H);
      ctx.restore();
    }
    if (FILTER_OK) ctx.filter = "none";

    if (p.tint > 0 && def.tintColor){
      var rgb = hexRgb(def.tintColor);
      ctx.globalCompositeOperation = "overlay";
      ctx.globalAlpha = p.tint;
      ctx.fillStyle = "rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";
      ctx.fillRect(0,0,W,H);
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    }

    retouch(W,H);
    bloom(W,H,p.bloom||0);
    mosaic(W,H);

    if (p.scan > 0){
      ctx.fillStyle = "rgba(0,0,0,"+p.scan+")";
      var step = Math.max(3, Math.round(H/240));
      for (var y=0;y<H;y+=step){ ctx.fillRect(0,y,W,1); }
    }
    if (p.grain > 0 && grainPat){
      ctx.globalCompositeOperation = "overlay";
      ctx.globalAlpha = p.grain;
      ctx.save();
      ctx.translate(-Math.random()*96,-Math.random()*96);
      ctx.fillStyle = grainPat;
      ctx.fillRect(0,0,W+96,H+96);
      ctx.restore();
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    }
    if (p.vig > 0){ ctx.fillStyle = vignette(W,H,p.vig,def.cold,def.warm); ctx.fillRect(0,0,W,H); }
    if (S.dateOn){
      var size = Math.round(H*0.055);
      ctx.font = size + 'px "VT323", monospace';
      ctx.textAlign = "right"; ctx.textBaseline = "alphabetic";
      ctx.shadowColor = "rgba(255,138,30,.85)";
      ctx.shadowBlur = size*0.5;
      ctx.fillStyle = "#FF8A1E";
      ctx.fillText(S.recording ? S.stamp : stampNow(), W - size*0.6, H - size*0.6);
      ctx.shadowBlur = 0;
    }
    if (S.editing) layoutHandles(W,H);
  }
  function updateFaceOsd(){
    if (!S.faceOn || S.faceState === "fail"){ faceOsd.textContent = ""; return; }
    faceOsd.textContent = S.lm ? "FACE" : "NO FACE";
    faceOsd.style.color = S.lm ? "#B8D6A4" : "#8FA07F";
    if (S.stream){
      if (S.lm && S.faceState !== "ok") setFaceStatus("ok","面部追踪：已锁定");
      else if (!S.lm && S.faceState === "ok") setFaceStatus("idle","面部追踪：暂时没找到脸");
    }
  }
  function meter(){
    if (!S.analyser) return;
    S.analyser.getByteFrequencyData(S.audioData);
    for (var i=0;i<bars.length;i++){
      var v = S.audioData[i*3] || 0;
      bars[i].style.height = (2 + Math.round(v/255*14)) + "px";
      bars[i].style.background = v > 190 ? "#FF6A5E" : (v > 60 ? "#FF8A1E" : "#8FA07F");
    }
  }

  /* ================== 纹路编辑手柄 ================== */
  var HND = ["a","b","m","w"];
  var HND_T = { a:"起点", b:"终点", m:"移动", w:"粗细" };
  var hnd = {};
  HND.forEach(function(t){
    var d = document.createElement("div");
    d.className = "hnd" + (t==="w"?" w":"") + (t==="m"?" m":"");
    d.dataset.t = HND_T[t];
    editLayer.appendChild(d);
    hnd[t] = d;
    var drag = null;
    d.addEventListener("pointerdown", function(e){
      e.preventDefault(); e.stopPropagation();
      drag = { x:e.clientX, y:e.clientY, base:JSON.parse(JSON.stringify(S.rgn[S.rgnSel])) };
      d.setPointerCapture && d.setPointerCapture(e.pointerId);
    });
    window.addEventListener("pointermove", function(e){
      if (!drag) return;
      var r = stage.getBoundingClientRect();
      var fs = faceNormH();
      var asp = r.width / r.height;
      var sdx = (e.clientX - drag.x) / r.width;    // 屏幕归一化
      var sdy = (e.clientY - drag.y) / r.height;
      var du  = (S.flip ? -sdx : sdx) * asp / fs;  // 换成“脸长单位”
      var dv  = sdy / fs;
      var g = S.rgn[S.rgnSel], b = drag.base;
      if (t === "a"){ g.ax = b.ax + du; g.ay = b.ay + dv; }
      else if (t === "b"){ g.bx = b.bx + du; g.by = b.by + dv; }
      else if (t === "m"){ g.ax = b.ax + du; g.ay = b.ay + dv; g.bx = b.bx + du; g.by = b.by + dv; }
      else {
        var n = Math.hypot(du, dv) * (dv + du > 0 ? 1 : -1);
        g.w = Math.max(.25, Math.min(3.5, b.w + n*3.2));
      }
    });
    window.addEventListener("pointerup", function(){ if (drag){ drag = null; save(); } });
  });
  function layoutHandles(W,H){
    if (!S.lm){ HND.forEach(function(t){ hnd[t].style.display = "none"; }); editPath.setAttribute("d",""); return; }
    ensureWork(W,H);
    var a = anchors(S.rgnSel);
    if (!a) return;
    var A = toMask(a.A), B = toMask(a.B), M = toMask(a.M);
    var C = { x:2*M.x - (A.x+B.x)/2, y:2*M.y - (A.y+B.y)/2 };
    var r = { w:hw, h:hh };
    function put(el,p){
      el.style.display = "block";
      el.style.left = (p.x/r.w*100) + "%";
      el.style.top  = (p.y/r.h*100) + "%";
    }
    put(hnd.a,A); put(hnd.b,B); put(hnd.m,M);
    var dx = B.x-A.x, dy = B.y-A.y, len = Math.hypot(dx,dy) || 1;
    var nx = -dy/len, ny = dx/len;
    var wpx = a.w*hh;
    put(hnd.w, { x:M.x + nx*wpx/2, y:M.y + ny*wpx/2 });
    editPath.setAttribute("d", "M " + (A.x/r.w*100) + " " + (A.y/r.h*100) +
      " Q " + (C.x/r.w*100) + " " + (C.y/r.h*100) + " " + (B.x/r.w*100) + " " + (B.y/r.h*100));
    editPath.setAttribute("stroke-width", (wpx/r.h*100));
    $("editSvg").setAttribute("viewBox","0 0 100 100");
    $("editSvg").setAttribute("preserveAspectRatio","none");
  }
  $("toggleEdit").onclick = function(){
    S.editing = !S.editing;
    this.setAttribute("aria-pressed", S.editing);
    editLayer.classList.toggle("on", S.editing);
    cueEl.style.opacity = S.editing ? ".2" : "";
  };

  /* ================== 开关 ================== */
  $("toggleDate").onclick = function(){ S.dateOn = !S.dateOn; this.setAttribute("aria-pressed", S.dateOn); save(); };
  $("toggleFlip").onclick = function(){ S.flip = !S.flip; this.setAttribute("aria-pressed", S.flip); save(); };
  $("toggleFace").onclick = function(){
    S.faceOn = !S.faceOn; this.setAttribute("aria-pressed", S.faceOn);
    if (!S.faceOn){ S.lm = null; S.sm = null; }
    save();
  };
  function setSource(v){
    S.source = v;
    $("srcCam").setAttribute("aria-pressed", v==="cam");
    $("srcScreen").setAttribute("aria-pressed", v==="screen");
    $("srcBoth").setAttribute("aria-pressed", v==="both");
    if (S.stream){ warn("画面来源改了，按一下开启画面重新连接。"); }
  }
  $("srcCam").onclick = function(){ setSource("cam"); };
  $("srcScreen").onclick = function(){ setSource("screen"); };
  $("srcBoth").onclick = function(){ setSource("both"); };
  function setLang(v){
    S.lang = v;
    $("langZh").setAttribute("aria-pressed", v==="zh-CN");
    $("langEn").setAttribute("aria-pressed", v==="en-GB");
    $("langEnUs").setAttribute("aria-pressed", v==="en-US");
    $("langOff").setAttribute("aria-pressed", v==="off");
    save();
  }
  $("langZh").onclick = function(){ setLang("zh-CN"); };
  $("langEn").onclick = function(){ setLang("en-GB"); cueHint(); };
  $("langEnUs").onclick = function(){ setLang("en-US"); cueHint(); };
  $("langOff").onclick = function(){ setLang("off"); cueHint(); };

  /* ================== 连接 ================== */
  btnConnect.onclick = function(){ connect(); };
  function stopStream(){
    if (S.stream){ S.stream.getTracks().forEach(function(t){ t.stop(); }); S.stream = null; }
    if (S.canvasStream){ S.canvasStream.getTracks().forEach(function(t){ t.stop(); }); S.canvasStream = null; }
    if (S.raf){ cancelAnimationFrame(S.raf); S.raf = 0; }
    if (S.audioCtx){ try{ S.audioCtx.close(); }catch(e){} S.audioCtx = null; S.analyser = null; }
  }
  function connect(){
    warn(""); stopStream();
    var task;
    if (S.source === "cam"){
      task = navigator.mediaDevices.getUserMedia({
        video:{ width:{ideal:1280}, height:{ideal:720}, facingMode:"user" },
        audio:{ echoCancellation:true, noiseSuppression:true }
      });
    } else if (S.source === "screen"){
      task = navigator.mediaDevices.getDisplayMedia({ video:true, audio:true });
    } else {
      task = Promise.all([
        navigator.mediaDevices.getDisplayMedia({ video:true, audio:true }),
        navigator.mediaDevices.getUserMedia({ audio:{ echoCancellation:true, noiseSuppression:true } })
      ]).then(function(both){ return mixStreams(both[0], both[1]); });
    }
    task.then(function(stream){
      S.stream = stream;
      preview.srcObject = stream;
      preview.play().catch(function(){});
      stageEmpty.style.display = "none";
      osd.classList.add("on");
      recWord.textContent = "STBY";
      btnRec.disabled = false;
      btnConnect.innerHTML = '<span class="en">SOURCE</span>换个来源';
      setupMeter(stream);
      if (!S.raf) drawFrame();
      if (!FILTER_OK) warn("这个浏览器的画布不支持滤镜和磨皮，会按原样录制。用 Chrome 打开就正常。");
      else if (!mp4Status()) warn("这个浏览器不能直接录 MP4，会存成 WebM（画质一样，多数剪辑软件都能读）。想要 MP4 请把浏览器升级到新版 Chrome 或用 Safari。");
      stream.getVideoTracks()[0].addEventListener("ended", function(){
        warn("画面来源断了。按一下开启画面重新连接。");
        if (S.recording) stopRec(true);
        btnRec.disabled = true;
        osd.classList.remove("on");
        stageEmpty.style.display = "flex";
      });
    }).catch(function(err){
      var m = "拿不到画面权限：" + (err && err.name ? err.name : "未知错误") + "。";
      if (String(err && err.name) === "NotAllowedError"){
        m += " 把这个文件下载到本地用 Chrome 打开，或者在文件夹里跑 python3 -m http.server 再访问 localhost。";
      }
      warn(m);
    });
  }
  function mixStreams(screen, mic){
    var c = new (window.AudioContext || window.webkitAudioContext)();
    var dest = c.createMediaStreamDestination();
    if (screen.getAudioTracks().length){ c.createMediaStreamSource(screen).connect(dest); }
    c.createMediaStreamSource(mic).connect(dest);
    var out = new MediaStream();
    out.addTrack(screen.getVideoTracks()[0]);
    out.addTrack(dest.stream.getAudioTracks()[0]);
    out._mixCtx = c;
    return out;
  }
  function setupMeter(stream){
    if (!stream.getAudioTracks().length) return;
    try {
      S.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var src = S.audioCtx.createMediaStreamSource(stream);
      S.analyser = S.audioCtx.createAnalyser();
      S.analyser.fftSize = 256;
      src.connect(S.analyser);
      S.audioData = new Uint8Array(S.analyser.frequencyBinCount);
    } catch(e){}
  }

  /* ================== 转录 ================== */
  function startRecog(){
    if (S.lang === "off") return;
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR){ warn("这个浏览器不支持实时转录和自动跟读，录制照常可用。"); return; }
    if (S.recog) return;
    try {
      S.recog = new SR();
      S.recog.lang = S.lang; S.recog.continuous = true; S.recog.interimResults = true;
      S.recog.maxAlternatives = 3;
      S.recog.onresult = function(e){
        var interim = "";
        S.altText = "";
        for (var i=e.resultIndex;i<e.results.length;i++){
          var r = e.results[i];
          if (r.isFinal){ S.finalText += r[0].transcript; } else { interim += r[0].transcript; }
        }
        S.interimText = interim;
        renderLive(); advanceCue();
      };
      S.recog.onend = function(){ if (S.recogWanted){ try{ S.recog.start(); }catch(e){} } };
      S.recog.onerror = function(e){
        if (e.error === "not-allowed"){ warn("语音识别被拒绝了，录制不受影响。"); S.recogWanted = false; }
      };
      S.recogWanted = true; S.recog.start();
    } catch(e){}
  }
  function stopRecog(){
    if (S.cueRehearse && !S.recording) return;
    S.recogWanted = false;
    if (S.recog){ try{ S.recog.stop(); }catch(e){} S.recog = null; }
  }
  function renderLive(){
    if (!S.finalText && !S.interimText){ liveEl.innerHTML = "<i>在听……</i>"; return; }
    liveEl.innerHTML = "<b></b><i></i>";
    liveEl.querySelector("b").textContent = S.finalText;
    liveEl.querySelector("i").textContent = S.interimText;
  }

  /* ================== 录制 ================== */
  /* 优先录 MP4。浏览器支持情况不一样：新版 Chrome 和 Safari 可以直接录
     H.264 的 MP4，老一点的只能录 WebM，这时如实告诉你，别假装导出的是 MP4。 */
  var MP4_LIST = [
    "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
    "video/mp4;codecs=avc1.4d002a,mp4a.40.2",
    "video/mp4;codecs=h264,aac",
    "video/mp4"
  ];
  var WEBM_LIST = ["video/webm;codecs=vp9,opus","video/webm;codecs=vp8,opus","video/webm"];
  function supported(list){
    for (var i=0;i<list.length;i++){
      if (window.MediaRecorder && MediaRecorder.isTypeSupported(list[i])) return list[i];
    }
    return "";
  }
  function pickMime(){ return supported(MP4_LIST) || supported(WEBM_LIST) || ""; }
  var MP4_OK = null;
  function mp4Status(){
    if (MP4_OK === null) MP4_OK = !!supported(MP4_LIST);
    return MP4_OK;
  }
  btnRec.onclick = function(){ S.recording ? stopRec(false) : startRec(); };
  btnPause.onclick = function(){ S.paused ? resumeRec() : pauseRec(); };
  btnDiscard.onclick = function(){ if (S.recording) stopRec(true); };
  function buildRecStream(){
    if (!S.canvasStream || !S.canvasStream.active){ S.canvasStream = cv.captureStream(30); }
    var out = new MediaStream();
    out.addTrack(S.canvasStream.getVideoTracks()[0]);
    S.stream.getAudioTracks().forEach(function(t){ out.addTrack(t); });
    return out;
  }
  function grabThumb(){ try { return cv.toDataURL("image/jpeg",0.6); } catch(e){ return null; } }
  function startRec(){
    if (!S.stream || !cv.width) return;
    warn("");
    S.chunks = []; S.finalText = ""; S.interimText = "";
    S.recAt = Date.now();
    S.cueMarks = []; S.asrMarks = [];
    S.stamp = stampNow();
    var mime = pickMime();
    try {
      S.recorder = new MediaRecorder(buildRecStream(), mime ? { mimeType:mime, videoBitsPerSecond:4000000 } : undefined);
    } catch(e){ warn("这个浏览器不支持录制。试试 Chrome。"); return; }
    S.recorder.ondataavailable = function(e){ if (e.data && e.data.size) S.chunks.push(e.data); };
    S.recorder.onstop = function(){ finishTake(); };
    S.recorder.start(1000);
    S.recording = true; S.paused = false;
    S.startAt = Date.now(); S.elapsed = 0;
    S.recFx = PRESETS[S.fx].en + (S.mo !== "off" ? "+" + MOSAIC[S.mo].en : "");
    S.thumb = grabThumb();
    S.cueIdx = 0; syncPtr(); renderCue();
    btnRec.innerHTML = '<span class="en">STOP</span>结束这一段';
    btnRec.classList.add("armed");
    btnPause.disabled = false; btnDiscard.disabled = false;
    osd.classList.add("on"); osd.classList.add("rec");
    recWord.textContent = "REC";
    liveEl.innerHTML = "<i>在听……</i>";
    startRecog();
    S.tick = setInterval(function(){
      if (!S.paused) timerEl.textContent = fmt(S.elapsed + (Date.now()-S.startAt));
    }, 250);
  }
  function pauseRec(){
    if (!S.recorder || S.recorder.state !== "recording") return;
    S.recorder.pause(); S.paused = true;
    S.elapsed += Date.now() - S.startAt;
    stopRecog(); osd.classList.remove("rec");
    recWord.textContent = "PAUSE";
    btnPause.innerHTML = '<span class="en">RESUME</span>继续';
  }
  function resumeRec(){
    if (!S.recorder || S.recorder.state !== "paused") return;
    S.recorder.resume(); S.paused = false;
    S.startAt = Date.now(); startRecog();
    osd.classList.add("rec"); recWord.textContent = "REC";
    btnPause.innerHTML = '<span class="en">PAUSE</span>暂停';
  }
  var discardFlag = false;
  function stopRec(discard){
    if (!S.recorder) return;
    discardFlag = !!discard;
    if (!S.paused) S.elapsed += Date.now() - S.startAt;
    S.recording = false;
    stopRecog();
    try { S.recorder.stop(); } catch(e){}
    S.paused = false;
    clearInterval(S.tick);
    btnRec.innerHTML = '<span class="en">REC</span>录这一段';
    btnRec.classList.remove("armed");
    btnPause.disabled = true; btnPause.innerHTML = '<span class="en">PAUSE</span>暂停';
    btnDiscard.disabled = true;
    osd.classList.remove("rec");
    recWord.textContent = "STBY";
    timerEl.textContent = "0:00:00";
  }
  function finishTake(){
    var dur = S.elapsed;
    var text = (S.finalText + S.interimText).trim();
    S.finalText = ""; S.interimText = "";
    if (discardFlag){ liveEl.innerHTML = "<i>这条丢掉了。</i>"; S.chunks = []; return; }
    if (!S.chunks.length || dur < 400){ liveEl.innerHTML = "<i>这段太短，没有保存。</i>"; S.chunks = []; return; }
    var blob = new Blob(S.chunks, { type:S.chunks[0].type || "video/webm" });
    var subs = buildSubs(dur);
    S.counter += 1;
    S.takes.push({
      id:"t"+Date.now()+"_"+S.counter, n:S.counter, dur:dur, text:text,
      note:(S.cueLines[0]||""), thumb:S.thumb, stamp:S.stamp, at:S.recAt, fx:S.recFx, subs:subs,
      blob:blob, url:URL.createObjectURL(blob),
      ext:(blob.type.indexOf("mp4")>-1)?"mp4":"webm"
    });
    S.chunks = [];
    liveEl.innerHTML = "<i>已存为第 " + S.counter + " 段。</i>";
    render(); save();
  }

  /* ================== 字幕 ==================
     字体都选了有年代感的：点阵、打字机、老宋体。
     样式是全局的，逐条改的是文字和时间。 */
  var SUB_FONTS = [
    { k:"vt",    cn:"点阵终端", css:'"VT323", monospace', sc:false, scale:1.35 },
    { k:"px",    cn:"像素游戏", css:'"Press Start 2P", monospace', sc:false, scale:0.72 },
    { k:"dot",   cn:"点阵日文", css:'"DotGothic16", "VT323", sans-serif', sc:true, scale:1.0 },
    { k:"type",  cn:"打字机",   css:'"Special Elite", "Courier Prime", monospace', sc:false, scale:1.0 },
    { k:"cour",  cn:"老式等宽", css:'"Courier Prime", "Courier New", monospace', sc:false, scale:1.0 },
    { k:"kai",   cn:"手写楷体", css:'"LXGW WenKai TC", "Kaiti SC", serif', sc:true, scale:1.05 },
    { k:"song",  cn:"老宋体",   css:'"Noto Serif SC", "Songti SC", serif', sc:true, scale:1.0 },
    { k:"zen",   cn:"圆点标题", css:'"Zen Dots", sans-serif', sc:false, scale:0.85 },
    { k:"sys",   cn:"系统黑体", css:'-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif', sc:true, scale:1.0 }
  ];
  var SUB_COLORS = ["#FBFDF8","#FFD9A8","#FF8A1E","#B8E6A0","#9CD2FF","#FFB3C7","#F2E14C","#2B2A25"];
  var SUB_DEFAULT = {
    font:"vt", size:6.4, color:"#FBFDF8", y:86, align:"center", width:88,
    box:0.3, boxColor:"#0A0C08", stroke:0.5, shadow:0.7, letter:0.02, upper:0
  };
  var SUB_SL = [
    { k:"size",   cn:"字号",   tip:"占画面高度",   min:2.5, max:14, step:.1, fmt:function(v){return v.toFixed(1)+"%"} },
    { k:"y",      cn:"上下位置", tip:"离画面顶部",  min:2,   max:96, step:.5, fmt:function(v){return v.toFixed(0)+"%"} },
    { k:"width",  cn:"宽度",   tip:"每行最宽",     min:30,  max:100, step:1, fmt:function(v){return Math.round(v)+"%"} },
    { k:"box",    cn:"背景条", tip:"底色深浅",     min:0,   max:1,  step:.02, fmt:pc },
    { k:"stroke", cn:"描边",   tip:"字的黑边",     min:0,   max:1,  step:.02, fmt:pc },
    { k:"shadow", cn:"阴影",   tip:"字下面的暗影",  min:0,   max:1,  step:.02, fmt:pc },
    { k:"letter", cn:"字距",   tip:"字与字的间隔",  min:0,   max:.3, step:.01, fmt:pc }
  ];
  S.sub = S.sub || JSON.parse(JSON.stringify(SUB_DEFAULT));
  function subFont(k){
    for (var i=0;i<SUB_FONTS.length;i++) if (SUB_FONTS[i].k === k) return SUB_FONTS[i];
    return SUB_FONTS[0];
  }
  var FPS = 30, FRAME = 1000/FPS;
  function tc(ms){
    ms = Math.max(0, Math.round(ms));
    var m = Math.floor(ms/60000), sec = Math.floor(ms%60000/1000);
    var fr = Math.round((ms%1000)/FRAME);
    if (fr >= FPS){ fr = FPS-1; }
    return two(m) + ":" + two(sec) + ":" + two(fr);
  }
  function buildSubs(dur){
    var out = [], i;
    if (S.cueMarks.length && S.cueLines.length){
      var marks = S.cueMarks.slice();
      if (marks[0].t > 200) marks.unshift({ t:0, i:marks[0].i });
      for (i=0;i<marks.length;i++){
        var txt = S.cueLines[marks[i].i] || "";
        if (!txt) continue;
        out.push({ s:Math.max(0,marks[i].t), e:(i+1<marks.length ? marks[i+1].t : dur), text:txt });
      }
    } else if (S.asrMarks.length){
      var prev = 0;
      for (i=0;i<S.asrMarks.length;i++){
        var m = S.asrMarks[i];
        if (!m.text) continue;
        out.push({ s:prev, e:Math.min(dur,m.t), text:m.text });
        prev = m.t;
      }
    }
    return out.filter(function(c){ return c.e > c.s + 60; });
  }
  function subsToSrt(subs, base){
    var out = [], n = 0;
    (subs||[]).forEach(function(c){
      if (!c.text.trim()) return;
      n += 1;
      out.push(String(n), srtTime((base||0)+c.s) + " --> " + srtTime((base||0)+c.e), c.text.trim(), "");
    });
    return out.join("\n");
  }
  /* 把字幕画到画布上，预览和烧录用的是同一个函数，所见即所得 */
  function drawSub(c, W, H, text){
    if (!text) return;
    var st = S.sub, f = subFont(st.font);
    var px = H * st.size / 100 * f.scale;
    c.save();
    c.font = px + "px " + f.css;
    c.textAlign = st.align === "left" ? "left" : (st.align === "right" ? "right" : "center");
    c.textBaseline = "alphabetic";
    var maxW = W * st.width / 100;
    var raw = st.upper ? text.toUpperCase() : text;
    var lines = [];
    raw.split("\n").forEach(function(para){
      var cur = "";
      var units = /[\u4e00-\u9fa5]/.test(para) ? para.split("") : para.split(/(\s+)/);
      units.forEach(function(u){
        var t = cur + u;
        if (c.measureText(t).width > maxW && cur){ lines.push(cur.trim()); cur = u.trim(); }
        else cur = t;
      });
      if (cur.trim()) lines.push(cur.trim());
    });
    var lh = px * 1.32;
    var x = st.align === "left" ? W*(100-st.width)/200
          : st.align === "right" ? W - W*(100-st.width)/200 : W/2;
    var top = H * st.y / 100 - lines.length*lh + lh*0.25;
    if (st.box > 0){
      var bw = 0;
      lines.forEach(function(l){ bw = Math.max(bw, c.measureText(l).width); });
      bw += px*0.7;
      var bx = st.align === "left" ? x - px*0.35
             : st.align === "right" ? x - bw + px*0.35 : x - bw/2;
      c.fillStyle = "rgba(" + hexRgb(st.boxColor).join(",") + "," + st.box + ")";
      c.fillRect(bx, top - lh*0.92, bw, lines.length*lh + px*0.35);
    }
    if (st.letter > 0 && c.letterSpacing !== undefined){
      c.letterSpacing = (px*st.letter).toFixed(1) + "px";
    }
    lines.forEach(function(l,i){
      var y = top + i*lh;
      if (st.shadow > 0){
        c.shadowColor = "rgba(0,0,0," + (st.shadow*0.9) + ")";
        c.shadowBlur = px*0.35; c.shadowOffsetY = px*0.06;
      }
      if (st.stroke > 0){
        c.lineWidth = px * 0.13 * st.stroke;
        c.lineJoin = "round";
        c.strokeStyle = "rgba(0,0,0," + Math.min(1, st.stroke*1.2) + ")";
        c.strokeText(l, x, y);
      }
      c.shadowBlur = 0; c.shadowOffsetY = 0;
      c.fillStyle = st.color;
      c.fillText(l, x, y);
    });
    if (c.letterSpacing !== undefined) c.letterSpacing = "0px";
    c.restore();
  }
  function subAt(subs, ms){
    if (!subs) return "";
    for (var i=0;i<subs.length;i++){
      if (ms >= subs[i].s && ms < subs[i].e) return subs[i].text;
    }
    return "";
  }

  /* ---------- 字幕编辑器 ----------
     设计前提：校字幕就是「播一小段、退一点、改一个字、再播一遍」。
     所以每个操作都要能一步撤销，时间能直接打字改，键盘能走完全流程。 */
  var CPS_WARN = 9;
  var MIN_DUR = 400;
  var MAX_LINE = 20;         // 一行超过这么多字建议断开

  function cueDur(c){ return Math.max(0, c.e - c.s); }
  function cps(c){
    var n = (c.text||"").replace(/\s/g,"").length;
    var sec = cueDur(c)/1000;
    return sec > 0 ? n/sec : 0;
  }
  function sortSubs(a){ a.sort(function(x,y){ return x.s - y.s; }); }
  function parseTC(str, D){
    var m = String(str).trim().match(/^(\d+):(\d{1,2})(?::(\d{1,2}))?$/);
    if (m) return Math.min(D, (+m[1]*60 + +m[2])*1000 + (+(m[3]||0))*FRAME);
    var f = parseFloat(str);
    return isNaN(f) ? null : Math.min(D, f*1000);
  }

  function buildSubEditor(t, host){
    host.innerHTML = "";
    t.subs = t.subs || [];

    var sel = 0, loop = false, active = false, tlZoom = 1;
    var undo = [], redo = [];

    /* ---- 撤销：每次改动前拍一张快照，什么都能退回去 ---- */
    function snap(label){
      undo.push({ d:JSON.stringify(t.subs), label:label||"上一步" });
      if (undo.length > 60) undo.shift();
      redo.length = 0;
      refreshUndo();
    }
    function doUndo(){
      if (!undo.length) return;
      var cur = { d:JSON.stringify(t.subs), label:"重做" };
      var st = undo.pop();
      redo.push(cur);
      t.subs = JSON.parse(st.d);
      if (sel >= t.subs.length) sel = Math.max(0, t.subs.length-1);
      redraw(); paintCap(); save(); refreshUndo();
      flash("已撤销：" + st.label);
    }
    function doRedo(){
      if (!redo.length) return;
      undo.push({ d:JSON.stringify(t.subs), label:"撤销" });
      var st = redo.pop();
      t.subs = JSON.parse(st.d);
      if (sel >= t.subs.length) sel = Math.max(0, t.subs.length-1);
      redraw(); paintCap(); save(); refreshUndo();
      flash("已重做");
    }
    function refreshUndo(){
      undoB.disabled = !undo.length;
      redoB.disabled = !redo.length;
      undoB.title = undo.length ? ("撤销：" + undo[undo.length-1].label) : "没有可撤销的操作";
    }

    var wrap = document.createElement("div");
    wrap.className = "subeditor";
    wrap.tabIndex = 0;

    /* ===== 顶部固定区 ===== */
    var head = document.createElement("div");
    head.className = "subhead2";

    var vw = document.createElement("div");
    vw.className = "subvidwrap";
    var vid = document.createElement("video");
    vid.className = "subvid"; vid.playsInline = true;
    if (t.url) vid.src = t.url;
    var capCv = document.createElement("canvas");
    capCv.className = "subcapcv";
    vw.appendChild(vid); vw.appendChild(capCv);

    var side = document.createElement("div");
    side.className = "subside";

    /* 传输控制 */
    var ctl = document.createElement("div");
    ctl.className = "subctl";
    var playB = mkBtn("▶ 播放", togglePlay);
    playB.className = "playbtn";
    ctl.appendChild(playB);
    ctl.appendChild(mkBtn("◀ 帧", function(){ step(-1); }));
    ctl.appendChild(mkBtn("帧 ▶", function(){ step(1); }));
    var tcBox = document.createElement("span");
    tcBox.className = "tc"; tcBox.textContent = "00:00:00";
    tcBox.title = "当前播放位置，分:秒:帧";
    ctl.appendChild(tcBox);
    var loopB = mkBtn("↺ 循环这条", function(){
      loop = !loop;
      loopB.setAttribute("aria-pressed", loop);
      flash(loop ? "循环播放当前这条" : "已关闭循环");
    });
    ctl.appendChild(loopB);
    var undoB = mkBtn("↶ 撤销", doUndo);
    var redoB = mkBtn("↷ 重做", doRedo);
    ctl.appendChild(undoB); ctl.appendChild(redoB);
    side.appendChild(ctl);

    /* 时间轴 */
    var tlWrap = document.createElement("div");
    tlWrap.className = "subtlwrap";
    var tl = document.createElement("div");
    tl.className = "subtl";
    var tlRuler = document.createElement("div");
    tlRuler.className = "subtlruler";
    var tlTrack = document.createElement("div");
    tlTrack.className = "subtltrack";
    var tlHead = document.createElement("div");
    tlHead.className = "subtlhead";
    tl.appendChild(tlRuler); tl.appendChild(tlTrack); tl.appendChild(tlHead);
    tlWrap.appendChild(tl);
    side.appendChild(tlWrap);

    var zoomRow = document.createElement("div");
    zoomRow.className = "subzoom";
    var zLab = document.createElement("span");
    zLab.textContent = "时间轴";
    var zIn = mkBtn("放大", function(){ setZoom(tlZoom*1.6); });
    var zOut = mkBtn("缩小", function(){ setZoom(tlZoom/1.6); });
    var zFit = mkBtn("看全部", function(){ setZoom(1); });
    zoomRow.appendChild(zLab); zoomRow.appendChild(zOut); zoomRow.appendChild(zIn); zoomRow.appendChild(zFit);
    var stat = document.createElement("span");
    stat.className = "substat";
    zoomRow.appendChild(stat);
    side.appendChild(zoomRow);

    head.appendChild(vw); head.appendChild(side);
    wrap.appendChild(head);

    /* ===== 工具条 ===== */
    var bar = document.createElement("div");
    bar.className = "subbar";
    function tool(label, fn, title, primary){
      var b = mkBtn(label, fn);
      if (title) b.title = title;
      if (primary) b.classList.add("primary");
      bar.appendChild(b);
      return b;
    }
    tool("＋ 在播放处新建", addHere, "在当前播放位置插入一条新字幕", true);
    tool("✂ 在播放处拆开", splitHere, "把当前这条从播放位置切成两条");
    tool("⇥ 与下一条合并", mergeNext, "把这一条和下一条并成一条");
    var shiftB = tool("⇄ 整体平移", toggleShift, "所有字幕一起提前或延后");
    tool("✓ 检查并修正", autoFix, "排好顺序、消除重叠、补齐过短的条目");
    tool("↻ 从提词稿重建", rebuild, "按稿子重新生成，会覆盖现有字幕");
    tool("↧ 导入 SRT", importSrt, "读入一个字幕文件，会覆盖现有字幕");
    tool("↥ 导出 SRT", exportSrt);
    var burnB = tool("● 烧录进视频", function(){ burnIn(t, burnB); }, "把字幕画进画面并导出视频");
    if (!t.url) burnB.disabled = true;
    wrap.appendChild(bar);

    /* 整体平移的小面板，比弹窗好用 */
    var shiftPanel = document.createElement("div");
    shiftPanel.className = "shiftpanel"; shiftPanel.hidden = true;
    var spTip = document.createElement("span");
    spTip.textContent = "字幕比画面早就点减，晚就点加：";
    shiftPanel.appendChild(spTip);
    [["-1 秒",-1000],["-0.5 秒",-500],["-1 帧",-FRAME],["+1 帧",FRAME],["+0.5 秒",500],["+1 秒",1000]]
      .forEach(function(b){
        shiftPanel.appendChild(mkBtn(b[0], function(){ shiftAll(b[1]); }));
      });
    wrap.appendChild(shiftPanel);

    var keyhint = document.createElement("p");
    keyhint.className = "subkeys";
    wrap.appendChild(keyhint);

    var rows = document.createElement("div");
    rows.className = "subrows";
    wrap.appendChild(rows);

    /* ===== 样式（收起来，不常改） ===== */
    var style = document.createElement("div");
    style.className = "substyle";
    var sBody = document.createElement("div");
    sBody.hidden = true;
    var sTog = mkBtn("字幕外观 ▾", function(){
      sBody.hidden = !sBody.hidden;
      sTog.textContent = sBody.hidden ? "字幕外观 ▾" : "字幕外观 ▴";
    });
    sTog.className = "subsecbtn";
    style.appendChild(sTog); style.appendChild(sBody);

    var fRow = document.createElement("div");
    fRow.className = "row";
    var fLab = document.createElement("span");
    fLab.className = "lbl"; fLab.textContent = "字体";
    var fsel = document.createElement("select");
    SUB_FONTS.forEach(function(f){
      var o = document.createElement("option");
      o.value = f.k; o.textContent = f.cn; o.style.fontFamily = f.css;
      fsel.appendChild(o);
    });
    fsel.value = S.sub.font;
    fsel.onchange = function(){ S.sub.font = fsel.value; paintCap(); save(); };
    fRow.appendChild(fLab); fRow.appendChild(fsel);
    var alignSeg = document.createElement("div");
    alignSeg.className = "seg";
    [["left","左"],["center","中"],["right","右"]].forEach(function(a){
      var b = document.createElement("button");
      b.type = "button"; b.textContent = a[1];
      b.setAttribute("aria-pressed", S.sub.align === a[0]);
      b.onclick = function(){
        S.sub.align = a[0];
        alignSeg.querySelectorAll("button").forEach(function(o,oi){
          o.setAttribute("aria-pressed", ["left","center","right"][oi] === a[0]);
        });
        paintCap(); save();
      };
      alignSeg.appendChild(b);
    });
    fRow.appendChild(alignSeg);
    var upB = mkBtn("全大写", function(){
      S.sub.upper = S.sub.upper ? 0 : 1;
      upB.setAttribute("aria-pressed", !!S.sub.upper);
      paintCap(); save();
    });
    upB.setAttribute("aria-pressed", !!S.sub.upper);
    fRow.appendChild(upB);
    sBody.appendChild(fRow);

    var cRow = document.createElement("div");
    cRow.className = "row";
    var cLab = document.createElement("span");
    cLab.className = "lbl"; cLab.textContent = "颜色";
    cRow.appendChild(cLab);
    SUB_COLORS.forEach(function(col){
      var b = document.createElement("button");
      b.type = "button"; b.className = "swatch"; b.style.background = col;
      b.setAttribute("aria-pressed", S.sub.color === col);
      b.onclick = function(){
        S.sub.color = col;
        cRow.querySelectorAll(".swatch").forEach(function(o,oi){
          o.setAttribute("aria-pressed", SUB_COLORS[oi] === col);
        });
        paintCap(); save();
      };
      cRow.appendChild(b);
    });
    sBody.appendChild(cRow);
    var slBox = document.createElement("div");
    slBox.className = "sliders";
    sBody.appendChild(slBox);
    buildSliders(slBox, SUB_SL, function(){ return S.sub; }, paintCap).sync();
    wrap.appendChild(style);

    var toast = document.createElement("div");
    toast.className = "subtoast"; toast.hidden = true;
    wrap.appendChild(toast);

    host.appendChild(wrap);

    /* ================= 行为 ================= */
    var toastT = 0;
    function flash(msg){
      toast.textContent = msg;
      toast.hidden = false;
      clearTimeout(toastT);
      toastT = setTimeout(function(){ toast.hidden = true; }, 2200);
    }
    function dur(){ return (vid.duration ? vid.duration*1000 : t.dur) || t.dur || 1000; }
    function ms(){ return vid.currentTime*1000; }
    function seek(v){
      v = Math.max(0, Math.min(dur()-1, v));
      vid.currentTime = v/1000;
    }
    function togglePlay(){
      if (!t.url) return;
      if (vid.paused){ vid.play(); playB.textContent = "❚❚ 暂停"; }
      else { vid.pause(); playB.textContent = "▶ 播放"; }
    }
    function step(n){
      vid.pause(); playB.textContent = "▶ 播放";
      seek(ms() + n*FRAME);
    }
    function setZoom(z){
      tlZoom = Math.max(1, Math.min(12, z));
      tlTrack.style.width = tlRuler.style.width = (tlZoom*100) + "%";
      paintTL(true);
    }

    var cvW = 480, cvH = 270;
    function fitCanvas(){
      var r = vw.getBoundingClientRect();
      if (!r.width) return;
      var ar = (vid.videoWidth && vid.videoHeight) ? vid.videoHeight/vid.videoWidth : 0.5625;
      var w = Math.round(r.width), h = Math.round(r.width*ar);
      if (capCv.width !== w || capCv.height !== h){ capCv.width = w; capCv.height = h; }
      cvW = w; cvH = h;
    }
    function paintCap(){
      fitCanvas();
      var c = capCv.getContext("2d");
      c.clearRect(0,0,cvW,cvH);
      drawSub(c, cvW, cvH, subAt(t.subs, ms()));
    }
    function activeIndex(){
      for (var i=0;i<t.subs.length;i++){
        if (ms() >= t.subs[i].s && ms() < t.subs[i].e) return i;
      }
      return -1;
    }
    function select(i, doSeek){
      if (!t.subs.length) return;
      i = Math.max(0, Math.min(t.subs.length-1, i));
      sel = i;
      if (doSeek) seek(t.subs[i].s + 30);
      markRows();
      var el = rows.children[i];
      if (el && el.scrollIntoView) el.scrollIntoView({ block:"nearest" });
    }

    /* ---- 时间轴 ---- */
    function paintRuler(){
      var D = dur()/1000;
      tlRuler.innerHTML = "";
      var pxPerSec = (tl.clientWidth*tlZoom) / D;
      var stepSec = 1;
      [1,2,5,10,15,30,60].some(function(v){ stepSec = v; return pxPerSec*v >= 46; });
      for (var sTick=0; sTick<=D; sTick+=stepSec){
        var m = document.createElement("span");
        m.className = "tick";
        m.style.left = (sTick/D*100) + "%";
        m.textContent = (stepSec >= 60)
          ? Math.round(sTick/60) + "分"
          : (sTick >= 60 ? (Math.floor(sTick/60) + ":" + two(Math.round(sTick%60))) : (Math.round(sTick) + "s"));
        tlRuler.appendChild(m);
      }
    }
    function paintTL(full){
      var D = dur();
      if (full) paintRuler();
      tlTrack.innerHTML = "";
      t.subs.forEach(function(c,i){
        var b = document.createElement("div");
        b.className = "tlblk" + (i === sel ? " sel" : "");
        var issue = cueDur(c) < MIN_DUR || !(c.text||"").trim() || cps(c) > CPS_WARN ||
                    (i+1 < t.subs.length && t.subs[i+1].s < c.e - 20);
        if (issue) b.classList.add("warnblk");
        b.style.left = (c.s/D*100) + "%";
        b.style.width = Math.max(0.4, cueDur(c)/D*100) + "%";
        b.title = (i+1) + ". " + (c.text||"(空)") + "\n拖两边改时间，拖中间整条移动";
        var lb = document.createElement("span");
        lb.className = "tlbl"; lb.textContent = (c.text||"").slice(0,14);
        b.appendChild(lb);
        b.onclick = function(e){ e.stopPropagation(); select(i, true); };
        ["l","r","m"].forEach(function(part){
          var h = document.createElement("span");
          h.className = "tlh " + part;
          b.appendChild(h);
          h.addEventListener("pointerdown", function(e){
            e.preventDefault(); e.stopPropagation();
            snap(part === "m" ? "移动第 " + (i+1) + " 条" : "改第 " + (i+1) + " 条的时间");
            sel = i;
            var r0 = tlTrack.getBoundingClientRect();
            var st = { x:e.clientX, s:c.s, e:c.e };
            h.setPointerCapture && h.setPointerCapture(e.pointerId);
            function mv(ev){
              var d = (ev.clientX - st.x)/r0.width*D;
              if (part === "l") c.s = Math.max(0, Math.min(st.s + d, c.e - MIN_DUR));
              else if (part === "r") c.e = Math.min(D, Math.max(st.e + d, c.s + MIN_DUR));
              else {
                var w = st.e - st.s;
                c.s = Math.max(0, Math.min(D - w, st.s + d));
                c.e = c.s + w;
              }
              paintTL(); redrawTimes(i); paintCap();
            }
            function up(){
              window.removeEventListener("pointermove", mv);
              window.removeEventListener("pointerup", up);
              save();
            }
            window.addEventListener("pointermove", mv);
            window.addEventListener("pointerup", up);
          });
        });
        tlTrack.appendChild(b);
      });
      tlHead.style.left = (ms()/D*100*tlZoom) + "%";
      updateStat();
    }
    function issues(){
      var bad = [];
      t.subs.forEach(function(c,i){
        var m = [];
        if (cueDur(c) < MIN_DUR) m.push("时间太短");
        if (c.e > dur() + 200) m.push("超出片长");
        if (i+1 < t.subs.length && t.subs[i+1].s < c.e - 20) m.push("和下一条重叠");
        if (!(c.text||"").trim()) m.push("没有文字");
        if (cps(c) > CPS_WARN) m.push("字太多来不及读");
        if (m.length) bad.push({ i:i, msg:m.join("、") });
      });
      return bad;
    }
    function updateStat(){
      var bad = issues();
      stat.innerHTML = "";
      var a = document.createElement("span");
      a.textContent = t.subs.length + " 条";
      stat.appendChild(a);
      if (bad.length){
        var b = document.createElement("button");
        b.type = "button"; b.className = "badbtn";
        b.textContent = bad.length + " 条要看一下";
        b.title = bad.map(function(x){ return (x.i+1) + "：" + x.msg; }).join("\n");
        b.onclick = function(){ select(bad[0].i, true); flash("第 " + (bad[0].i+1) + " 条：" + bad[0].msg); };
        stat.appendChild(b);
      } else if (t.subs.length){
        var g = document.createElement("span");
        g.className = "good"; g.textContent = "没有问题";
        stat.appendChild(g);
      }
    }
    tl.addEventListener("pointerdown", function(e){
      if (e.target !== tl && e.target !== tlTrack && e.target !== tlRuler && !e.target.classList.contains("tick")) return;
      var r = tlTrack.getBoundingClientRect();
      seek((e.clientX - r.left)/r.width*dur());
    });

    function markRows(){
      var act = activeIndex();
      Array.prototype.forEach.call(rows.children, function(el,i){
        el.classList.toggle("now", i === act);
        el.classList.toggle("sel", i === sel);
      });
      paintTL();
    }
    function metaText(c){
      var r = Math.round(cps(c)*10)/10;
      var secs = (cueDur(c)/1000).toFixed(1);
      var out = secs + " 秒 · " + r + " 字每秒";
      if (r > CPS_WARN) out += " · 偏快";
      var longest = 0;
      (c.text||"").split("\n").forEach(function(l){ longest = Math.max(longest, l.length); });
      if (longest > MAX_LINE) out += " · 这行偏长，可以断行";
      return out;
    }
    function redrawTimes(i){
      var el = rows.children[i];
      if (!el) return;
      var c = t.subs[i];
      var vs = el.querySelectorAll(".tval");
      if (vs[0] && document.activeElement !== vs[0]) vs[0].value = tc(c.s);
      if (vs[1] && document.activeElement !== vs[1]) vs[1].value = tc(c.e);
      var m = el.querySelector(".submeta");
      if (m) m.textContent = metaText(c);
    }

    function redraw(){
      rows.innerHTML = "";
      if (!t.subs.length){
        var em = document.createElement("div");
        em.className = "subempty";
        var p1 = document.createElement("p");
        p1.textContent = "这段还没有字幕。三种起手方式：";
        var b1 = mkBtn("按提词稿生成", rebuild);
        b1.classList.add("primary");
        var b2 = mkBtn("播到某处新建一条", addHere);
        var b3 = mkBtn("导入 SRT 文件", importSrt);
        var box = document.createElement("div");
        box.className = "row";
        box.appendChild(b1); box.appendChild(b2); box.appendChild(b3);
        em.appendChild(p1); em.appendChild(box);
        rows.appendChild(em);
        paintTL(true);
        return;
      }
      t.subs.forEach(function(c,i){
        var row = document.createElement("div");
        row.className = "subrow";
        row.onclick = function(){ if (sel !== i){ sel = i; markRows(); } };

        var idx = document.createElement("button");
        idx.type = "button"; idx.className = "subidx";
        idx.textContent = String(i+1);
        idx.title = "跳到这一条";
        idx.onclick = function(e){ e.stopPropagation(); select(i, true); };

        var mid = document.createElement("div");
        mid.className = "submid";
        var ta = document.createElement("textarea");
        ta.value = c.text; ta.rows = 2;
        ta.placeholder = "这一条说的话";
        var typing = false;
        ta.onfocus = function(){ sel = i; markRows(); typing = false; };
        ta.oninput = function(){
          if (!typing){ snap("改第 " + (i+1) + " 条的文字"); typing = true; }
          c.text = ta.value; redrawTimes(i); paintCap(); paintTL(); save();
        };
        ta.onblur = function(){ typing = false; };
        var meta = document.createElement("span");
        meta.className = "submeta"; meta.textContent = metaText(c);
        mid.appendChild(ta); mid.appendChild(meta);

        var times = document.createElement("div");
        times.className = "subtimes";
        [["s","入"],["e","出"]].forEach(function(kk){
          var key = kk[0];
          var g = document.createElement("div");
          g.className = "tgroup";
          var lab = document.createElement("span");
          lab.className = "tlab"; lab.textContent = kk[1];
          /* 时间码是输入框，可以直接打字；也能按住左右拖着调 */
          var val = document.createElement("input");
          val.className = "tval"; val.value = tc(c[key]);
          val.title = "可以直接输入 分:秒:帧，也可以按住左右拖";
          val.onfocus = function(){ sel = i; markRows(); };
          val.onchange = function(){
            var v = parseTC(val.value, dur());
            if (v === null){ val.value = tc(c[key]); flash("时间格式看不懂，写成 00:12:15 这样"); return; }
            snap("改第 " + (i+1) + " 条的时间");
            c[key] = v;
            if (key==="s" && c.s > c.e - MIN_DUR) c.e = c.s + MIN_DUR;
            if (key==="e" && c.e < c.s + MIN_DUR) c.s = Math.max(0, c.e - MIN_DUR);
            redrawTimes(i); seek(c[key]); paintCap(); paintTL(); save();
          };
          var dragging = null;
          val.addEventListener("pointerdown", function(e){
            if (document.activeElement === val) return;
            e.preventDefault();
            dragging = { x:e.clientX, v:c[key], moved:false };
            val.setPointerCapture && val.setPointerCapture(e.pointerId);
          });
          val.addEventListener("pointermove", function(e){
            if (!dragging) return;
            var d = e.clientX - dragging.x;
            if (!dragging.moved && Math.abs(d) < 3) return;
            if (!dragging.moved){ dragging.moved = true; snap("改第 " + (i+1) + " 条的时间"); }
            c[key] = Math.max(0, dragging.v + Math.round(d/3)*FRAME);
            if (key==="s" && c.s > c.e - MIN_DUR) c.e = c.s + MIN_DUR;
            if (key==="e" && c.e < c.s + MIN_DUR) c.s = Math.max(0, c.e - MIN_DUR);
            val.value = tc(c[key]);
            paintTL(); paintCap();
          });
          val.addEventListener("pointerup", function(){
            if (dragging && dragging.moved){ seek(c[key]); redrawTimes(i); save(); }
            else if (dragging){ val.focus(); val.select(); }
            dragging = null;
          });
          var mB = mkBtn("−", function(){ nudge(-1); });
          var pB = mkBtn("＋", function(){ nudge(1); });
          mB.className = pB.className = "nudge";
          mB.title = pB.title = "一帧，按住 Shift 是十帧";
          function nudge(dir){
            snap("改第 " + (i+1) + " 条的时间");
            var k = (window.event && window.event.shiftKey) ? 10 : 1;
            c[key] = Math.max(0, c[key] + dir*k*FRAME);
            if (key==="s" && c.s > c.e - MIN_DUR) c.e = c.s + MIN_DUR;
            if (key==="e" && c.e < c.s + MIN_DUR) c.s = Math.max(0, c.e - MIN_DUR);
            redrawTimes(i); seek(c[key]); paintCap(); paintTL(); save();
          }
          var setB = mkBtn("⌖", function(){
            snap("把第 " + (i+1) + " 条的" + kk[1] + "点设到播放处");
            c[key] = Math.round(ms());
            if (key==="s" && c.s > c.e - MIN_DUR) c.e = c.s + MIN_DUR;
            if (key==="e" && c.e < c.s + MIN_DUR) c.s = Math.max(0, c.e - MIN_DUR);
            redrawTimes(i); paintCap(); paintTL(); save();
          });
          setB.className = "nudge";
          setB.title = "设成当前播放位置";
          g.appendChild(lab); g.appendChild(mB); g.appendChild(val); g.appendChild(pB); g.appendChild(setB);
          times.appendChild(g);
        });

        var ops = document.createElement("div");
        ops.className = "subops";
        var opBtns = [
          ["插入", function(){
            snap("插入一条");
            var end = (i+1 < t.subs.length) ? t.subs[i+1].s : Math.min(dur(), c.e + 1800);
            t.subs.splice(i+1, 0, { s:c.e, e:Math.max(c.e + MIN_DUR, end), text:"" });
            redraw(); select(i+1, false); save();
          }],
          ["合并下一条", function(){ sel = i; mergeNext(); }],
          ["删除", function(){
            snap("删除第 " + (i+1) + " 条");
            t.subs.splice(i,1);
            if (sel >= t.subs.length) sel = Math.max(0, t.subs.length-1);
            redraw(); save(); flash("已删除，可以按撤销找回");
          }]
        ];
        opBtns.forEach(function(b){
          var el2 = mkBtn(b[0], function(e){ b[1](); });
          if (b[0] === "合并下一条" && i === t.subs.length-1) el2.disabled = true;
          ops.appendChild(el2);
        });

        row.appendChild(idx); row.appendChild(mid);
        row.appendChild(times); row.appendChild(ops);
        rows.appendChild(row);
      });
      markRows();
    }

    /* ---- 工具动作 ---- */
    function addHere(){
      snap("新建一条");
      var at = Math.round(ms());
      var end = dur();
      for (var k=0;k<t.subs.length;k++){ if (t.subs[k].s > at){ end = t.subs[k].s; break; } }
      var c = { s:at, e:Math.max(at + MIN_DUR, Math.min(end, at + 2500)), text:"" };
      t.subs.push(c); sortSubs(t.subs);
      redraw();
      select(t.subs.indexOf(c), false);
      var el = rows.children[t.subs.indexOf(c)];
      var ta = el && el.querySelector("textarea");
      if (ta) ta.focus();
      flash("已新建，直接打字");
    }
    function splitHere(){
      var at = Math.round(ms());
      var i = activeIndex();
      if (i < 0){ addHere(); return; }
      var c = t.subs[i];
      if (at <= c.s + FRAME || at >= c.e - FRAME){ flash("播放头要停在这一条中间才能拆"); return; }
      snap("拆开第 " + (i+1) + " 条");
      t.subs.splice(i+1, 0, { s:at, e:c.e, text:"" });
      c.e = at;
      redraw(); select(i+1, false); save();
    }
    function mergeNext(){
      if (sel < 0 || sel+1 >= t.subs.length){ flash("这已经是最后一条了"); return; }
      snap("合并第 " + (sel+1) + " 和 " + (sel+2) + " 条");
      var a = t.subs[sel], b = t.subs[sel+1];
      a.e = b.e;
      a.text = (a.text + (a.text && b.text ? " " : "") + b.text).trim();
      t.subs.splice(sel+1,1);
      redraw(); save();
    }
    function setPoint(kk){
      if (!t.subs.length) return;
      var c = t.subs[sel];
      if (!c) return;
      snap("设第 " + (sel+1) + " 条的" + (kk==="s"?"入":"出") + "点");
      c[kk] = Math.round(ms());
      if (kk==="s" && c.s > c.e - MIN_DUR) c.e = c.s + MIN_DUR;
      if (kk==="e" && c.e < c.s + MIN_DUR) c.s = Math.max(0, c.e - MIN_DUR);
      redrawTimes(sel); paintTL(); paintCap(); save();
      flash((kk==="s"?"入":"出") + "点已设为 " + tc(c[kk]));
    }
    function toggleShift(){
      shiftPanel.hidden = !shiftPanel.hidden;
      shiftB.setAttribute("aria-pressed", !shiftPanel.hidden);
    }
    function shiftAll(d){
      if (!t.subs.length) return;
      snap("整体平移");
      t.subs.forEach(function(c){
        c.s = Math.max(0, c.s + d);
        c.e = Math.max(c.s + MIN_DUR, c.e + d);
      });
      redraw(); paintCap(); save();
      flash("全部" + (d>0?"延后":"提前") + " " + Math.abs(Math.round(d)) + " 毫秒");
    }
    function autoFix(){
      if (!t.subs.length) return;
      var bad = issues();
      if (!bad.length){ flash("检查过了，没有问题"); return; }
      snap("自动修正");
      sortSubs(t.subs);
      var D = dur();
      for (var i=0;i<t.subs.length;i++){
        var c = t.subs[i];
        c.s = Math.max(0, c.s);
        if (c.e > D) c.e = D;
        if (c.e < c.s + MIN_DUR) c.e = Math.min(D, c.s + MIN_DUR);
        if (i+1 < t.subs.length && t.subs[i+1].s < c.e){
          var mid2 = (c.e + t.subs[i+1].s)/2;
          if (mid2 > c.s + MIN_DUR){ c.e = mid2; t.subs[i+1].s = mid2; }
          else t.subs[i+1].s = c.e;
        }
      }
      t.subs = t.subs.filter(function(c){ return c.e > c.s + 60; });
      redraw(); paintCap(); save();
      flash("修好了 " + bad.length + " 处，不满意可以撤销");
    }
    function rebuild(){
      if (!S.cueLines.length){ flash("提词稿是空的，先去右上角提词标签写几句"); return; }
      if (t.subs.length && !confirm("会用提词稿覆盖现在的 " + t.subs.length + " 条字幕。继续吗？\n（做完还可以按撤销）")) return;
      snap("从提词稿重建");
      var lens = S.cueLines.map(function(l){ return Math.max(2, l.replace(/\s/g,"").length); });
      var total = lens.reduce(function(a,b){ return a+b; }, 0);
      var D = dur(), at = 0;
      t.subs = S.cueLines.map(function(l,i){
        var d = D*lens[i]/total;
        var c = { s:Math.round(at), e:Math.round(at+d), text:l };
        at += d;
        return c;
      });
      redraw(); paintCap(); save();
      flash("按字数分配了时间，接下来逐条对一下");
    }
    function importSrt(){
      var inp = document.createElement("input");
      inp.type = "file"; inp.accept = ".srt,text/plain";
      inp.onchange = function(){
        var f = inp.files && inp.files[0];
        if (!f) return;
        var fr = new FileReader();
        fr.onload = function(){
          var out = [];
          String(fr.result).replace(/\r/g,"").split(/\n\n+/).forEach(function(b){
            var m = b.match(/(\d\d):(\d\d):(\d\d)[,.](\d{1,3})\s*-->\s*(\d\d):(\d\d):(\d\d)[,.](\d{1,3})/);
            if (!m) return;
            var lines = b.split(/\n/);
            var skip = lines[0].match(/^\d+$/) ? 2 : 1;
            out.push({
              s:(+m[1]*3600 + +m[2]*60 + +m[3])*1000 + +m[4],
              e:(+m[5]*3600 + +m[6]*60 + +m[7])*1000 + +m[8],
              text:lines.slice(skip).join("\n").trim()
            });
          });
          if (!out.length){ flash("这个文件里没读到字幕"); return; }
          if (t.subs.length && !confirm("会覆盖现在的 " + t.subs.length + " 条字幕。继续吗？")) return;
          snap("导入 SRT");
          t.subs = out; sortSubs(t.subs);
          redraw(); paintCap(); save();
          flash("导入了 " + out.length + " 条");
        };
        fr.readAsText(f);
      };
      inp.click();
    }
    function exportSrt(){
      var srt = subsToSrt(t.subs, 0);
      if (!srt){ flash("还没有字幕内容"); return; }
      dlText(srt, stampName(t) + ".srt", "text/plain;charset=utf-8");
      flash("已导出 SRT");
    }

    /* ---- 播放事件 ---- */
    function onTime(){
      tcBox.textContent = tc(ms());
      paintCap(); markRows();
      if (loop && t.subs[sel] && !vid.paused){
        var c = t.subs[sel];
        if (ms() >= c.e || ms() < c.s - 200) seek(c.s);
      }
    }
    vid.addEventListener("loadedmetadata", function(){ paintCap(); paintTL(true); });
    vid.addEventListener("timeupdate", onTime);
    vid.addEventListener("seeked", onTime);
    vid.addEventListener("ended", function(){ playB.textContent = "▶ 播放"; });
    window.addEventListener("resize", function(){ paintCap(); paintTL(true); });

    /* ---- 键盘：点一下编辑器就接管，点外面就交还 ---- */
    function setActive(on){
      if (active === on) return;
      active = on;
      wrap.classList.toggle("armed", on);
      keyhint.innerHTML = on
        ? '<b>键盘已接管</b> · 空格 播放暂停 · ←→ 一帧（按住 Shift 十帧） · ↑↓ 选上下条 · I 设入点 · O 设出点 · Enter 在播放处拆开 · Ctrl+Z 撤销'
        : '点一下编辑器空白处，就能用键盘操作（空格播放、方向键走帧、I 和 O 设入出点）。';
    }
    setActive(false);
    wrap.addEventListener("pointerdown", function(){ setActive(true); });
    document.addEventListener("pointerdown", function(e){
      if (!wrap.contains(e.target)) setActive(false);
    }, true);
    document.addEventListener("keydown", function(e){
      if (!active || !host.isConnected || host.hidden) return;
      if (/^(TEXTAREA|INPUT|SELECT)$/.test(e.target.tagName)) return;
      var big = e.shiftKey ? 10 : 1;
      var k = e.key;
      if ((e.ctrlKey || e.metaKey) && (k === "z" || k === "Z")){
        e.preventDefault(); e.stopPropagation();
        if (e.shiftKey) doRedo(); else doUndo();
        return;
      }
      if (e.code === "Space"){ e.preventDefault(); e.stopPropagation(); togglePlay(); }
      else if (k === "ArrowLeft"){ e.preventDefault(); e.stopPropagation(); step(-big); }
      else if (k === "ArrowRight"){ e.preventDefault(); e.stopPropagation(); step(big); }
      else if (k === "ArrowUp"){ e.preventDefault(); e.stopPropagation(); select(sel-1, true); }
      else if (k === "ArrowDown"){ e.preventDefault(); e.stopPropagation(); select(sel+1, true); }
      else if (k === "i" || k === "I"){ e.preventDefault(); setPoint("s"); }
      else if (k === "o" || k === "O"){ e.preventDefault(); setPoint("e"); }
      else if (k === "Enter"){ e.preventDefault(); splitHere(); }
    }, true);

    refreshUndo();
    redraw();
    setZoom(1);
    setTimeout(function(){ paintCap(); paintTL(true); }, 60);
  }

  /* 把字幕烧进画面：原片放一遍，逐帧画到画布上再录一次 */
  var burnAbort = false;
  async function burnIn(t, btn){
    if (!t.url) return;
    if (btn.dataset.busy === "1"){ burnAbort = true; btn.textContent = "正在停止"; return; }
    var v = document.createElement("video");
    v.src = t.url; v.muted = false; v.playsInline = true;
    await new Promise(function(res){ v.onloadedmetadata = res; });
    var secs = Math.ceil(v.duration || t.dur/1000);
    if (!confirm("烧录要把视频完整放一遍，大约需要 " + secs + " 秒。期间别关页面。\n开始吗？")) return;
    var W = v.videoWidth || 1280, H = v.videoHeight || 720;
    var c = mkc(); c.width = W; c.height = H;
    var cx2 = c.getContext("2d");
    var stream = c.captureStream(FPS);
    var ac = null;
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      var srcN = ac.createMediaElementSource(v);
      var dest = ac.createMediaStreamDestination();
      srcN.connect(dest);
      dest.stream.getAudioTracks().forEach(function(tr){ stream.addTrack(tr); });
    } catch(e){}
    var mime = pickMime();
    var rec;
    try { rec = new MediaRecorder(stream, mime ? { mimeType:mime, videoBitsPerSecond:5000000 } : undefined); }
    catch(e){ warn("这个浏览器不支持烧录导出。"); return; }
    var parts = [];
    rec.ondataavailable = function(e){ if (e.data && e.data.size) parts.push(e.data); };
    var done = new Promise(function(res){ rec.onstop = res; });
    var old = btn.textContent;
    btn.dataset.busy = "1";
    burnAbort = false;
    rec.start(500);
    v.currentTime = 0;
    await v.play();
    var raf2 = 0;
    function tick(){
      cx2.drawImage(v, 0, 0, W, H);
      drawSub(cx2, W, H, subAt(t.subs, v.currentTime*1000));
      btn.textContent = "烧录中 " + Math.round(v.currentTime/(v.duration||1)*100) + "%（点这里停止）";
      if (burnAbort){ v.pause(); v.dispatchEvent(new Event("ended")); return; }
      raf2 = requestAnimationFrame(tick);
    }
    tick();
    await new Promise(function(res){ v.onended = res; });
    cancelAnimationFrame(raf2);
    rec.stop();
    await done;
    try { if (ac) ac.close(); } catch(e){}
    btn.dataset.busy = "0";
    btn.textContent = old;
    if (burnAbort){ liveEl.innerHTML = "<i>烧录已取消。</i>"; return; }
    var blob = new Blob(parts, { type:parts.length ? parts[0].type : "video/mp4" });
    var ext = blob.type.indexOf("mp4") > -1 ? "mp4" : "webm";
    var where = await saveBlob(blob, stampName(t) + " 字幕." + ext);
    liveEl.innerHTML = "<i>" + (where ? ("带字幕的视频已存到 " + where) : "带字幕的视频已下载") + "。</i>";
  }

  /* ================== 列表 ================== */
  function render(){
    var box = $("takes");
    box.innerHTML = "";
    $("noTakes").style.display = S.takes.length ? "none" : "block";
    var total = 0;
    S.takes.forEach(function(t){ total += t.dur; });
    $("tally").textContent = S.takes.length + " 段";
    $("footTally").textContent = fmt(total);
    var hasVideo = S.takes.some(function(t){ return !!t.url; });
    $("btnDownloadAll").disabled = !hasVideo;
    $("btnExportMd").disabled = !S.takes.length;
    $("btnExportSrt").disabled = !S.takes.length;

    S.takes.forEach(function(t, idx){
      var el = document.createElement("div");
      el.className = "take" + (t.url ? "" : " dim");
      var print = document.createElement("div");
      print.className = "print";
      print.title = t.url ? "点开预览这一段" : "视频已随会话结束，只剩文字";
      var film = document.createElement("div");
      film.className = "film";
      if (t.thumb){
        var img = document.createElement("img"); img.src = t.thumb; img.alt = "";
        film.appendChild(img);
      } else {
        var none = document.createElement("div");
        none.className = "none"; none.textContent = "NO IMAGE";
        film.appendChild(none);
      }
      var dur = document.createElement("span");
      dur.className = "dur"; dur.textContent = fmtShort(t.dur);
      film.appendChild(dur);
      if (t.fx && t.fx !== "OFF"){
        var tag = document.createElement("span");
        tag.className = "fxtag"; tag.textContent = t.fx;
        film.appendChild(tag);
      }
      print.appendChild(film);
      print.onclick = function(){ playTake(t); };

      var body = document.createElement("div"); body.className = "body";
      var top = document.createElement("div"); top.className = "top";
      var tid = document.createElement("span");
      tid.className = "tid"; tid.textContent = "第 " + two(t.n) + " 段";
      top.appendChild(tid);
      if (t.note){
        var nt = document.createElement("span");
        nt.className = "tnote"; nt.textContent = t.note.slice(0,32);
        top.appendChild(nt);
      }
      var tools = document.createElement("div"); tools.className = "tools";
      tools.appendChild(mkBtn("上移", function(){ move(idx,-1); }, idx===0));
      tools.appendChild(mkBtn("下移", function(){ move(idx,1); }, idx===S.takes.length-1));
      tools.appendChild(mkBtn("重录", function(){ retake(idx); }));
      var subHost = document.createElement("div");
      subHost.className = "subhost"; subHost.hidden = true;
      tools.appendChild(mkBtn("字幕" + ((t.subs&&t.subs.length)?(" "+t.subs.length):""), function(){
        subHost.hidden = !subHost.hidden;
        if (!subHost.hidden) buildSubEditor(t, subHost);
      }));
      if (t.url) tools.appendChild(mkBtn("保存", function(){ saveTake(t); }));
      tools.appendChild(mkBtn("删除", function(){ del(idx); }));
      top.appendChild(tools);

      var ta = document.createElement("textarea");
      ta.value = t.text || "";
      ta.placeholder = "这段没有转录文字，可以自己写";
      ta.oninput = function(){ t.text = ta.value; save(); };

      body.appendChild(top); body.appendChild(ta); body.appendChild(subHost);
      el.appendChild(print); el.appendChild(body);
      box.appendChild(el);
    });
  }
  function mkBtn(label, fn, disabled){
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = label; b.onclick = fn;
    if (disabled) b.disabled = true;
    return b;
  }
  /* 文件名用开始录制那一刻的时间：26-08-11 14.49
     同一分钟里录了不止一条时，后面的补上 -2、-3，免得互相覆盖 */
  function stampName(t){
    var d;
    if (t.at) d = new Date(t.at);
    else if (t.stamp){
      var m = String(t.stamp).match(/'(\d{2}) (\d{2}) (\d{2})\s+(\d{2}):(\d{2})/);
      if (m) return m[1] + "-" + m[2] + "-" + m[3] + " " + m[4] + "." + m[5];
      d = new Date();
    } else d = new Date();
    return two(d.getFullYear()%100) + "-" + two(d.getMonth()+1) + "-" + two(d.getDate()) +
           " " + two(d.getHours()) + "." + two(d.getMinutes());
  }
  function filename(t){
    var base = stampName(t), dup = 0, seen = 0;
    for (var i=0;i<S.takes.length;i++){
      if (stampName(S.takes[i]) !== base) continue;
      seen++;
      if (S.takes[i] === t) dup = seen;
    }
    if (seen > 1 && dup > 1) base += "-" + dup;
    return base + "." + (t.ext || "mp4");
  }
  function playTake(t){
    if (!t.url) return;
    var w = window.open("","_blank");
    if (!w) return;
    w.document.write('<title>第 ' + t.n + ' 段</title><body style="margin:0;background:#0F120D">' +
      '<video src="' + t.url + '" controls autoplay style="width:100%;height:100%"></video></body>');
  }
  function move(i,dir){
    var j = i+dir;
    if (j<0 || j>=S.takes.length) return;
    var tmp = S.takes[i]; S.takes[i] = S.takes[j]; S.takes[j] = tmp;
    render(); save();
  }
  function del(i){
    var t = S.takes[i];
    if (t.url) URL.revokeObjectURL(t.url);
    S.takes.splice(i,1); render(); save();
  }
  function retake(i){
    del(i);
    S.cueIdx = 0; syncPtr(); renderCue();
    liveEl.innerHTML = "<i>提词回到开头，重录这一段。</i>";
    window.scrollTo({ top:0, behavior:"smooth" });
  }
  /* ---------- 保存到指定文件夹 ----------
     用 File System Access API。文件夹句柄存在 IndexedDB 里，
     下次打开还是同一个文件夹，只需要点一次「允许」。
     Chrome 和 Edge 支持；Safari 和 Firefox 没有这个接口，会退回普通下载。 */
  var FS_OK = !!(window.showDirectoryPicker && window.indexedDB);
  var dirHandle = null;

  function idbOpen(){
    return new Promise(function(res,rej){
      var r = indexedDB.open("dv8", 1);
      r.onupgradeneeded = function(){ r.result.createObjectStore("kv"); };
      r.onsuccess = function(){ res(r.result); };
      r.onerror = function(){ rej(r.error); };
    });
  }
  function idbPut(k,v){
    return idbOpen().then(function(db){
      return new Promise(function(res,rej){
        var tr = db.transaction("kv","readwrite");
        tr.objectStore("kv").put(v,k);
        tr.oncomplete = function(){ res(); };
        tr.onerror = function(){ rej(tr.error); };
      });
    });
  }
  function idbGet(k){
    return idbOpen().then(function(db){
      return new Promise(function(res,rej){
        var tr = db.transaction("kv","readonly");
        var rq = tr.objectStore("kv").get(k);
        rq.onsuccess = function(){ res(rq.result || null); };
        rq.onerror = function(){ rej(rq.error); };
      });
    });
  }

  function folderLabel(){
    var b = $("btnFolder");
    if (!b) return;
    if (!FS_OK){ b.textContent = "浏览器不支持选文件夹"; b.disabled = true; b.title = "Chrome 或 Edge 才有这个功能，其他浏览器会走普通下载"; return; }
    b.textContent = dirHandle ? ("保存到：" + dirHandle.name) : "选择保存文件夹";
    b.title = dirHandle ? "点一下可以换成别的文件夹" : "选一次之后就会记住，下次直接存进去";
  }
  async function ensurePerm(ask){
    if (!dirHandle) return false;
    try {
      var opt = { mode:"readwrite" };
      var st = await dirHandle.queryPermission(opt);
      if (st === "granted") return true;
      if (!ask) return false;
      st = await dirHandle.requestPermission(opt);
      return st === "granted";
    } catch(e){ return false; }
  }
  async function pickFolder(){
    if (!FS_OK) return;
    try {
      dirHandle = await window.showDirectoryPicker({ id:"dv8out", mode:"readwrite", startIn:"videos" });
      await idbPut("dirHandle", dirHandle);
      folderLabel();
      liveEl.innerHTML = "<i>以后都会存到「" + dirHandle.name + "」。</i>";
    } catch(e){ /* 用户取消 */ }
  }
  function anchorDL(blob,name){
    var u = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = u; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(u); }, 4000);
  }
  async function saveBlob(blob,name){
    if (dirHandle && await ensurePerm(true)){
      try {
        var fh = await dirHandle.getFileHandle(name, { create:true });
        var w = await fh.createWritable();
        await w.write(blob);
        await w.close();
        return dirHandle.name;
      } catch(e){
        warn("写入文件夹失败，这次改成普通下载。可能是文件夹被移动或删掉了，重新选一次即可。");
      }
    }
    anchorDL(blob,name);
    return null;
  }
  function urlToBlob(url){
    return fetch(url).then(function(r){ return r.blob(); });
  }
  async function saveTake(t){
    var blob = t.blob || (t.url ? await urlToBlob(t.url) : null);
    if (!blob) return;
    var name = filename(t);
    var where = await saveBlob(blob, name);
    liveEl.innerHTML = "<i>" + (where ? ("已存到 " + where + "／" + name) : ("已下载 " + name)) + "</i>";
  }
  function dlText(text,name,mime){
    saveBlob(new Blob([text], { type:mime || "text/plain;charset=utf-8" }), name);
  }
  $("btnDownloadAll").onclick = async function(){
    var list = S.takes.filter(function(t){ return t.url; });
    for (var i=0;i<list.length;i++){
      await saveTake(list[i]);
      if (!dirHandle) await new Promise(function(r){ setTimeout(r, 500); });
    }
    if (dirHandle) liveEl.innerHTML = "<i>" + list.length + " 段已全部存到 " + dirHandle.name + "。</i>";
  };
  $("btnExportMd").onclick = function(){
    var lines = ["# 录制记录 " + $("today").textContent, ""], total = 0;
    S.takes.forEach(function(t){ total += t.dur; });
    lines.push("共 " + S.takes.length + " 段，总时长 " + fmt(total) + "。", "");
    S.takes.forEach(function(t){
      lines.push("## 第 " + two(t.n) + " 段  (" + fmtShort(t.dur) + "，" + (t.fx||"") + ")");
      lines.push("", (t.text || "(无转录)"), "");
    });
    dlText(lines.join("\n"), "录制记录-" + $("today").textContent + ".md", "text/markdown;charset=utf-8");
  };
  $("btnExportSrt").onclick = function(){
    var out = [], cursor = 0, n = 0;
    S.takes.forEach(function(t){
      if (t.subs && t.subs.length){
        t.subs.forEach(function(c){
          if (!c.text.trim()) return;
          n += 1;
          out.push(String(n), srtTime(cursor+c.s) + " --> " + srtTime(cursor+c.e), c.text.trim(), "");
        });
      } else {
        var txt = (t.text||"").trim();
        if (txt){ n+=1; out.push(String(n), srtTime(cursor)+" --> "+srtTime(cursor+t.dur), txt, ""); }
      }
      cursor += t.dur;
    });
    if (!out.length){ warn("没有可导出的文字。"); return; }
    dlText(out.join("\n"), "字幕-" + $("today").textContent + ".srt", "text/plain;charset=utf-8");
  };
  $("btnClear").onclick = function(){
    if (!S.takes.length) return;
    if (!confirm("清空所有片段和文字？这个撤不回来。")) return;
    S.takes.forEach(function(t){ if (t.url) URL.revokeObjectURL(t.url); });
    S.takes = []; S.counter = 0; render(); save();
  };

  /* ================== 存档 ==================
     放在 GitHub Pages 上时没有 window.storage，改用浏览器自己的 localStorage，
     设置就存在你这台电脑的这个浏览器里，换机器不会跟着走，
     所以另外给了导出和导入设置文件的按钮。 */
  var SKEY = "takerec:session";
  var Store = {
    get:function(k){
      if (window.storage) return window.storage.get(k);
      try { var v = localStorage.getItem(k); return Promise.resolve(v ? { key:k, value:v } : null); }
      catch(e){ return Promise.resolve(null); }
    },
    set:function(k,v){
      if (window.storage) return window.storage.set(k,v);
      localStorage.setItem(k,v);
      return Promise.resolve(null);
    }
  };
  function settingsOnly(){
    return {
      v:1,
      lang:S.lang, fx:S.fx, dateOn:S.dateOn, flip:S.flip,
      custom:S.custom, skin:S.skin, warp:S.warp, rgn:S.rgn,
      mo:S.mo, moP:S.moP, faceOn:S.faceOn,
      cue:S.cue, cueColor:S.cueColor, cueAlign:S.cueAlign, cuePos:S.cuePos,
      cueRaw:S.cueRaw, cueAuto:S.cueAuto, cueOn:S.cueOn, sub:S.sub
    };
  }
  function payloadOf(withThumbs){
    var o = settingsOnly();
    o.counter = S.counter;
    o.takes = S.takes.map(function(t){
      return { id:t.id, n:t.n, dur:t.dur, text:t.text, note:t.note,
               thumb: withThumbs ? t.thumb : null, stamp:t.stamp, at:t.at, fx:t.fx, subs:t.subs||null };
    });
    return o;
  }
  var saveTimer = 0, saveWarned = false;
  function save(){
    clearTimeout(saveTimer);
    saveTimer = setTimeout(doSave, 300);
  }
  function doSave(){
    try {
      Store.set(SKEY, JSON.stringify(payloadOf(true)));
    } catch(e){
      /* 多半是缩略图把配额撑爆了，去掉缩略图重存，设置本身一定要留住 */
      try { Store.set(SKEY, JSON.stringify(payloadOf(false))); }
      catch(e2){
        try { Store.set(SKEY, JSON.stringify(settingsOnly())); } catch(e3){}
        if (!saveWarned){
          saveWarned = true;
          warn("浏览器存储空间不够，片段缩略图没能保存，但你的美颜和滤镜设置已经存下来了。");
        }
      }
    }
  }
  function applySettings(p){
    if (!p) return;
    if (p.custom) S.custom = p.custom;
    if (p.skin){ Object.keys(SKIN_DEFAULT).forEach(function(k){ if (p.skin[k]!==undefined) S.skin[k]=p.skin[k]; }); }
    if (p.warp){ Object.keys(WARP_DEFAULT).forEach(function(k){ if (p.warp[k]!==undefined) S.warp[k]=p.warp[k]; }); }
    if (p.rgn){ RGN_KEYS.forEach(function(k){ if (p.rgn[k]) S.rgn[k]=p.rgn[k]; }); }
    if (p.moP){ Object.keys(MO_DEFAULT).forEach(function(k){ if (p.moP[k]!==undefined) S.moP[k]=p.moP[k]; }); }
    if (p.cue){ Object.keys(CUE_DEFAULT).forEach(function(k){ if (p.cue[k]!==undefined) S.cue[k]=p.cue[k]; }); }
    if (p.cueColor) S.cueColor = p.cueColor;
    if (p.cueAlign) S.cueAlign = p.cueAlign;
    if (p.cuePos) S.cuePos = p.cuePos;
    if (p.cueRaw){ S.cueRaw = p.cueRaw; S.cueLines = splitCue(p.cueRaw); $("cueText").value = p.cueRaw; buildCueIndex(); }
    if (p.sub){ Object.keys(SUB_DEFAULT).forEach(function(k){ if (p.sub[k]!==undefined) S.sub[k]=p.sub[k]; }); }
    if (p.cueAuto === false){ S.cueAuto = false; $("cueAuto").setAttribute("aria-pressed","false"); }
    if (p.cueOn === false){ S.cueOn = false; $("togglePrompt").setAttribute("aria-pressed","false"); }
    if (p.lang) setLang(p.lang);
    if (p.dateOn === false){ S.dateOn = false; $("toggleDate").setAttribute("aria-pressed","false"); }
    if (p.flip === true){ S.flip = true; $("toggleFlip").setAttribute("aria-pressed","true"); }
    if (p.faceOn === false){ S.faceOn = false; $("toggleFace").setAttribute("aria-pressed","false"); }
    setFx(p.fx && PRESETS[p.fx] ? p.fx : S.fx);
    setMo(p.mo && MOSAIC[p.mo] ? p.mo : S.mo);
    document.querySelectorAll(".swatch").forEach(function(o,i){
      o.setAttribute("aria-pressed", CUE_COLORS[i] === S.cueColor);
    });
    $("cueAlignL").setAttribute("aria-pressed", S.cueAlign==="left");
    $("cueAlignC").setAttribute("aria-pressed", S.cueAlign==="center");
    warpUI.sync(); localUI.sync(); skinUI.sync(); moUI.sync(); cueUI.sync();
    syncPtr(); renderCue(); cueHint();
  }
  function load(){
    setFx(S.fx); setMo(S.mo); setRgn(S.rgnSel);
    warpUI.sync(); localUI.sync(); skinUI.sync(); moUI.sync(); cueUI.sync();
    buildCueIndex(); renderCue(); cueHint();
    Store.get(SKEY).then(function(res){
      if (!res || !res.value){ render(); return; }
      var p = JSON.parse(res.value);
      S.counter = p.counter || 0;
      S.takes = (p.takes||[]).map(function(t){ t.blob = null; t.url = null; return t; });
      applySettings(p);
      render();
    }).catch(function(){ render(); });
  }

  $("btnFolder").onclick = function(){ pickFolder(); };
  if (FS_OK){
    idbGet("dirHandle").then(function(h){
      if (h){ dirHandle = h; folderLabel(); ensurePerm(false); }
    }).catch(function(){});
  }
  folderLabel();

  $("btnExportCfg").onclick = function(){
    dlText(JSON.stringify(settingsOnly(), null, 2),
      "dv8-设置-" + $("today").textContent + ".json", "application/json");
  };
  $("btnImportCfg").onclick = function(){ $("cfgFile").click(); };
  $("cfgFile").addEventListener("change", function(){
    var f = this.files && this.files[0];
    if (!f) return;
    var fr = new FileReader();
    fr.onload = function(){
      try {
        applySettings(JSON.parse(fr.result));
        save();
        warn("");
        liveEl.innerHTML = "<i>设置已导入。</i>";
      } catch(e){ warn("这个文件读不出来，可能不是导出的设置文件。"); }
    };
    fr.readAsText(f);
    this.value = "";
  });

  document.addEventListener("keydown", function(e){
    if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
    if (e.code === "Space"){ e.preventDefault(); if (!btnRec.disabled) btnRec.click(); }
    if (e.key === "p" && !btnPause.disabled){ btnPause.click(); }
    if (e.key === "ArrowDown"){ e.preventDefault(); $("cueNext").click(); }
    if (e.key === "ArrowUp"){ e.preventDefault(); $("cuePrev").click(); }
  });
  window.addEventListener("resize", renderCue);
  window.addEventListener("beforeunload", function(e){
    if (S.takes.some(function(t){ return t.url; })){ e.preventDefault(); e.returnValue = ""; }
  });

  if (document.fonts && document.fonts.load){
    ['16px "VT323"','16px "Press Start 2P"','16px "DotGothic16"','16px "Special Elite"',
     '16px "Courier Prime"','16px "LXGW WenKai TC"','16px "Noto Serif SC"','16px "Zen Dots"']
      .forEach(function(f){ document.fonts.load(f).catch(function(){}); });
  }
  load();
})();
