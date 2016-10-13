var navUsrVers=navigator.userAgent;
if (navUsrVers.indexOf('Windows')!=-1) {
    document.write('<link rel="stylesheet" href="resources/DAM-Windows.css" type="text/css" />');
} else if (navUsrVers.indexOf('Android')!=-1) {
    document.write('<link rel="stylesheet" href="resources/DAM-Android.css" type="text/css" />');
} else if (navUsrVers.indexOf('Linux')!=-1) {
    document.write('<link rel="stylesheet" href="resources/DAM-Linux.css" type="text/css" />');
} else if (navUsrVers.indexOf('iPad')!=-1) {
    document.write('<link rel="stylesheet" href="resources/DAM-iPad.css" type="text/css" />');
}