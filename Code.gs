function checkNetatmo(account) {
  var dateStr = function(d) {return Utilities.formatDate(new Date(d * 1000), Session.getScriptTimeZone(), 'yyyy/MM/dd HH:mm:ss')};
  var nowTime = Math.floor(new Date().getTime() / 1000);
  var prop = PropertiesService.getScriptProperties();
  var accessToken = getAccessToken(0, prop, nowTime, account);
  var url = "https://api.netatmo.com/api/getstationsdata?access_token=" + accessToken;
  var res = UrlFetchApp.fetch(url, {muteHttpExceptions: true});
  if (res.getResponseCode() == 200) {
    res = JSON.parse(res.getContentText());
    if (!("body" in res)) error(3);
    var results = res.body.devices.reduce(function(devices, e) {
      if (account.diffTime < nowTime - e.dashboard_data.time_utc) devices.push({id: e._id, lastTime: dateStr(e.dashboard_data.time_utc)});
      var modules = e.modules.reduce(function(m, f) {
        var temp = {id: f._id};
        if (account.diffTime < nowTime - f.dashboard_data.time_utc) {
          temp.lastTime = dateStr(f.dashboard_data.time_utc);
        }
        if (account.batteryPercent > f.battery_percent) {
          temp.batteryPercent = f.battery_percent;
        }
        if (temp.lastTime || temp.batteryPercent) m.push(temp);
        return m;
      }, []);
      if (modules.length > 0) Array.prototype.push.apply(devices, modules);
      return devices;
    }, []);
    if (results.length > 0) {
      var body = results.reduce(function(s, e) {
        return s + "- Device ID is " + e.id + "\r\n" +
          (e.lastTime ? "Update from this device is stopping. Last update is " + e.lastTime + ".\r\n" : "") +
          (e.batteryPercent ? "Battery is low. Current battery is " + e.batteryPercent + " %.\r\n" : "") +
          "\r\n";
      }, "Notification: Netatmo's condition. Detected devices are below.\r\n\r\n");
      MailApp.sendEmail({to: account.mail, subject: "Notification: Netatmo's condition", body: body});
    } else {
      Logger.log("All devices of Netatmo are working fine.");
    }
  }
}

function getAccessToken(c, prop, nowTime, account, refreshToken) {
  var token = prop.getProperties();
  var params = {method: "post", muteHttpExceptions: true, payload: {"client_id": account.clientId, "client_secret": account.clientSecret}};
  if (!token.refreshToken) {
    if (!account.clientId || !account.clientSecret || !account.userName || !account.password) error(1);
    params.payload.grant_type = "password";
    params.payload.scope = "read_station";
    params.payload.username = account.userName;
    params.payload.password = account.password;
  } else if (token.expire < nowTime) {
    if (!account.clientId || !account.clientSecret) error(2);
    params.payload.grant_type = "refresh_token";
    params.payload.refresh_token = token.refreshToken;
  } else {
    return encodeURIComponent(token.accessToken);
  }
  var res = UrlFetchApp.fetch("https://api.netatmo.com/oauth2/token", params);
  if (res.getResponseCode() == 200) {
    res = res.getContentText();
  } else {
    if (c == 0) {
      c += 1;
      delete token.refreshToken;
      getAccessToken(c, prop, nowTime, account, refreshToken);
    } else {
      error(4);
    }
  }
  res = JSON.parse(res);
  prop.setProperties({
    refreshToken: res.refresh_token,
    accessToken: res.access_token,
    expire: (nowTime + res.expires_in - 300),
  });
  return encodeURIComponent(res.access_token);
}

function error(e) {
  var m = "";
  switch (e) {
    case 1:
      m = "Parameters for retrieving access token is insufficient.";
      break;
    case 2:
      m = "Parameters for retrieving access token using refresh token is insufficient.";
      break;
    case 3:
      m = "Data couldn't be retrieved.";
      break;
    case 4:
      m = "Netatmo's server is down.";
      break;
  }
  throw new Error(m);
}


// Please set these parameters.
function run() {
  var account = {
    clientId: "#####", // You can get when you registered an app to Netatmo.
    clientSecret: "#####", // You can get when you registered an app to Netatmo.
    userName: "#####", // Account for logging in to Netatmo.
    password: "#####", // Account for logging in to Netatmo.
    diffTime: 900, // When the data is not updated from the time that the script was run to before diffTime, it can confirm that Netatmo is down.
    batteryPercent: 10, // When the battery charge is less than batteryPercent, this script sends an email as the notification.
    mail: "#####", // This is used for sending the email.
  };
  checkNetatmo(account);
}
