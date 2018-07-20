Notifying-with-email-when-Netatmo-was-down
=====

<a name="TOP"></a>
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENCE)

<a name="Overview"></a>
# Overview
This is a Google Apps Script for notifying with email when Netatmo was down.

<a name="Description"></a>
# Description
I'm measuring the surrounding environment using Netatmo. There were little that my Netatmo was down so far. But recently, my Netatmo is sometimes down. It is considered that the reason is due to the thermal runaway, because the recent Japan is very hot. When Netatmo was down, users can know it by logging in using the browser and/or running the mobile application. But I couldn't find the applications and methods for automatically noticing that the Netatmo was down. So I thought that this can be achieved using Netatmo API and Google Apps Script. And I created this. If this is also useful for other Netatmo's users, I'm glad.

# How to Install
At first, it prepares to use Netatmo's API. As the next step, it installs the script.

## 1. Create App to Netatmo
1. Access to [https://dev.netatmo.com/](https://dev.netatmo.com/), and click "CREATE YOUR APP". When the log in screen is displayed, please Log in to Netatmo.
1. As a new App, input Name, Description, Data Protection Officer name and Data Protection Officer email. And check "I accept Netatmo APIs Terms and Conditions". Then please click "Save".
1. After saving the configuration of App, please copy "Client id" and "Client secret".

## 2. Install GAS Script
1. Copy and paste [the script](https://github.com/tanaikech/Notifying-with-email-when-Netatmo-was-down/blob/master/Code.gs) to your script editor.
    - In order to open the script editor, visit [script.google.com](https://script.google.com/), and click "Start Scripting". By this the script editor is opened. (You'll need to be signed in to your Google account.) If this is the first time you've been to script.google.com, you'll be redirected to a page that introduces Apps Script. Click Start Scripting to proceed to the script editor. ([Ref.](https://developers.google.com/apps-script/overview))
1. Input your parameters to JSON object of ``account`` in ``run()``.
    - ``clientId`` and ``clientSecret`` are used for using [Netatmo's API](https://dev.netatmo.com/resources/technical/reference).
    - ``userName`` and ``password`` are for log in to Netatmo.
    - ``diffTime`` is used for checking whether Netatmo are working. The unit is second. When the data is not updated from the time that the script was run to before ``diffTime``, it can confirm that Netatmo is down. As a sample, I set this to 900.
    - ``batteryPercent`` is the battery charge. The unit is %. When the battery charge is less than ``batteryPercent``, this script sends an email as the notification. As a sample, I set this to 10.
    - ``mail`` is used for sending the email.
- After above flow is finished, please manually run ``run()`` once. By this, the authorization screen is displayed. So please authorize it. This authorization is only one time.
    - When the script is run, if your Netatmo is working fine, you can see "All devices of Netatmo are working fine." at the log of GAS.

**When [a time-driven triggers](https://developers.google.com/apps-script/guides/triggers/installable#managing_triggers_manually) is installed to "run()", this script can continue to check your Netatmo with the cycle set by the time-driven triggers.** As a sample. I set this to 15 minutes which is the same with ``diffTime``.

# Related applications
- If you want to check Netatmo's condition using a CLI application, you can also use [this](https://github.com/tanaikech/gonetatmo).

-----

<a name="Licence"></a>
# Licence
[MIT](LICENCE)

<a name="Author"></a>
# Author
[Tanaike](https://tanaikech.github.io/about/)

If you have any questions and commissions for me, feel free to tell me.

<a name="Update_History"></a>
# Update History
* v1.0.0 (July 20, 2018)

    1. Initial release.


[TOP](#TOP)

