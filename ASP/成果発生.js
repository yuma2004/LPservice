(function acsTrack() {
    var PV = "phv1yfjl0dx8";
    var KEYS = { cid: ["CL_", "ACT_", "cid_auth_get_type"], plid: ["PL_", "APT_", "plid_auth_get_type"] };
    var turl = "https://jass-net.com/track.php?p=" + PV;
    var cks = document.cookie.split("; ").reduce(function (ret, s) { var kv = s.split("="); if (kv[0] && kv[1]) ret[kv[0]] = kv[1]; return ret; }, []);
    turl = Object.keys(KEYS).reduce(function (url, k) { var vk = KEYS[k][0] + PV; var tk = KEYS[k][1] + PV; var v = "", t = ""; if (cks[vk]) { v = cks[vk]; if (cks[tk]) t = cks[tk]; } else if (localStorage.getItem(vk)) { v = localStorage.getItem(vk); t = "ls"; } if (v) url += "&" + k + "=" + v; if (t) url += "&" + KEYS[k][2] + "=" + t; return url; }, turl);
    var xhr = new XMLHttpRequest(); xhr.open("GET", turl); xhr.send();
})();