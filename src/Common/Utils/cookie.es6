class cookie{

    /**
     * get cookie
     * @param cookieName
     * @returns {string}
     */
    static get(cookieName) {
        let result = "";
        if (document.cookie.length > 0) {
            let c_start = document.cookie.indexOf(cookieName + "=");
            if (c_start != -1) {
                c_start = c_start + cookieName.length + 1;
                let c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                result = unescape(document.cookie.substring(c_start, c_end));
                result = new myString(result).base64Decode().value;
            }
        }
        return result;
    }

    /**
     * set cookie
     * @param cookieName
     * @param cookieValue
     * @param expiredays
     */
    static set(cookieName, cookieValue, expiredays) {
        let exdate = new Date();
        cookieValue = new myString(cookieValue).base64Encode().value;

        exdate.setDate(exdate.getDate() + expiredays);
        let exdateStr = (expiredays == null) ? "" : ";expires=" + exdate.toGMTString();
        document.cookie = cookieName + "=" + escape(cookieValue) + exdateStr+";path=/";
    }

}

module.exports = cookie;