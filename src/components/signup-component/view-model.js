import $ from 'jquery';
import can from 'can';
import 'can/map/define/';
import restAPI from 'rest-api';
import i18n from 'easyapp/i18n/i18n';
import config from 'config';

export default can.Map.extend({
  i18n: i18n,
  buttonRunning: null,
  inputDisabled: null,
  generalError: false,
  userCreate: '',
  userCreateError: false,
  userCreateLengthError: false,
  userCreateAcceptedError: false,
  emailCreate: '',
  emailCreateError: false,
  emailCreateInvalidError: false,
  emailCheckFunc() {
    if (this.attr("emailCreate") != '') {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(this.attr("emailCreate")) && this.attr("emailCreate") != '') {
        this.attr("emailCreateInvalidError", false);
        if (this.attr('emailCreate') != '') {
          restAPI.requestUnsigned('GET', '/wapi/check-email/' + this.attr('emailCreate') + '/', {},
              () => {
                this.attr('emailCreateError', false);
              }, () => {
                this.attr('emailCreateError', true);
              });
        }
      } else {
        this.attr('emailCreateError', false);
        this.attr("emailCreateInvalidError", true);
      }
    } else {
      this.attr('emailCreateError', false);
      this.attr("emailCreateInvalidError", false);
    }
  },
  securityQuestionCreate: i18n.changeQuestionQuestions[0],
  securityAnswerCreate: '',
  securityAnswerError: false,
  lengthAnswerFunc() {
    if (this.attr("securityAnswerCreate").length < config.general.securityAnswerMinLength && this.attr("securityAnswerCreate") != '') {
      this.attr("securityAnswerError", true);
    } else {
      this.attr("securityAnswerError", false);
    }
  },
  passwordCreate: '',
  passwordRetypedCreate: '',
  passwordMismatchError: false,
  signUpFunc() {
    this.attr('generalError', false);
    this.attr("buttonRunning", 'disabled');
    this.attr("inputDisabled", 'disabled');

    if (!this.attr("emailCreateError")
        && !this.attr("emailCreateInvalidError")
        && !this.attr("securityAnswerError")
        && !this.attr("passwordMismatchError")
        && (this.attr("emailCreate") != '')
        && this.attr("securityAnswerCreate") != ''
        && this.attr("passwordCreate") != ''
        && this.attr("passwordRetypedCreate") != ''
        && this.attr("securityAnswerCreate").length >= config.general.securityAnswerMinLength) {

      if (!this.attr("secondFactorVisible") && (this.attr("hasEmail") || this.attr("hasPhone"))) this.attr("pleaseWaitMessage", true);

      let dataObj = {
        email: this.attr("emailCreate"),
        question: this.attr("securityQuestionCreate"),
        answer: this.attr("securityAnswerCreate"),
        pass: restAPI.hashMe(this.attr("passwordCreate")),
        retype: restAPI.hashMe(this.attr("passwordRetypedCreate")),
        lang: localStorage.getItem('locale'),
      };

      if (this.attr("hasEmail") && this.attr("hasPhone")) {
        dataObj.confirm = $('input[type=radio][name=confirm_with]:checked').val();
      }

      if (!this.attr("secondFactorVisible") || (this.attr("secondFactorVisible") && this.attr("secondFactorSignUp") != '')) {
        restAPI.requestUnsigned('POST', '/wapi/sign-up/', dataObj,
          () =>  {
              this.attr('generalError', false);
                $('#sign-up-modal').modal('hide');
                $('#login-modal').modal('show');
                this.attr("buttonRunning", null);
                this.attr("inputDisabled", null);

                // reset form
                this.attr("generalError", false);
                this.attr("userCreateError", false);
                this.attr("userCreateLengthError", false);
                this.attr("emailCreateError", false);
                this.attr("emailCreateInvalidError", false);
                this.attr("securityAnswerError", false);
                this.attr("passwordMismatchError", false);
                this.attr("passwordStrengthGood", false);
                this.attr("secondFactorVisible", false);
                this.attr("pleaseWaitMessage", false);
                this.attr("emailCreate", '');
                this.attr("securityAnswerCreate", '');
                this.attr("passwordCreate", '');
                this.attr("secondFactorLogin", '');
                this.attr("passwordRetypedCreate", '');
                this.attr("passwordStrengthText", '');
                this.attr("secondFactorSignUp", '');
                this.attr("passwordStrengthColor", 'red-text');
            },  () => {
              this.attr('generalError', true);
              this.attr("buttonRunning", null);
              this.attr("inputDisabled", null);
            });
      } else {
        this.attr("buttonRunning", null);
      }
    } else if (this.attr("secondFactorVisible")) {
      this.attr("buttonRunning", null);
      this.attr("secondFactorDisabled", null);
    } else {
      this.attr("buttonRunning", null);
      this.attr("inputDisabled", null);
      this.attr("secondFactorDisabled", null);
    }

    return false;
  },
  passwordStrengthText: '',
  passwordStrengthColor: 'red-text',
  strongPassFunc(pass) {

    if (pass != '') {
      let strongRegex = new RegExp("^(?=.{12,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
      let mediumRegex = new RegExp("^(?=.{10,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
      let enoughRegex = new RegExp("(?=.{8,}).*", "g");
      if (false == enoughRegex.test(pass)) {
        this.attr("passwordStrengthText", i18n.longerPasswordNeeded);
        this.attr("passwordStrengthColor", 'orange-text');
      } else if (strongRegex.test(pass)) {
        this.attr("passwordStrengthText", i18n.strongPassword);
        this.attr("passwordStrengthColor", 'green-text');
      } else if (mediumRegex.test(pass)) {
        this.attr("passwordStrengthText", i18n.okPassword);
        this.attr("passwordStrengthColor", 'black-text');
      } else {
        this.attr("passwordStrengthText", i18n.weakPassword);
        this.attr("passwordStrengthColor", 'orange-text');
      }
    }

  },
  comparePasswordFunc(pass2) {
    if (pass2.length >= this.attr("passwordCreate").length && pass2 != this.attr("passwordCreate")) {
      this.attr("passwordMismatchError", true);
    } else {
      this.attr("passwordMismatchError", false);
    }
  }
});