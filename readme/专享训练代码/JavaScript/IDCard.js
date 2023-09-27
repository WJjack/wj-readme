class IDCard {
    constructor(idcard) {
        this.idcard = idcard;
    }

    getInfo() {
        return {
            birthday: this.getBirthday(),
            age: this.getAge(),
            sex: this.getSex()
        }
    }

    getBirthday() {
        if (this.idcard.length === 15) {
            return ['19' + this.idcard.substr(6, 2), this.idcard.substr(8, 2), this.idcard.substr(10, 2)].join('-')
        } else if (this.idcard.length === 18) {
            return [this.idcard.substr(6, 4), this.idcard.substr(10, 2), this.idcard.substr(12, 2)].join('-')
        }
     
        return null
    }

    getSex() {
        if (this.idcard.length === 15) {
            return ['女', '男'][this.idcard.substr(14, 1) % 2];
        } else if (this.idcard.length === 18) {
            return ['女', '男'][this.idcard.substr(16, 1) % 2];
        }

        return null;
    }

    getAge() {
        //如果用户身份证号码为undefined则返回空
        if (!this.idcard) {
            return null;
        }

        // 获取出生日期
        const yearBirth = this.idcard.substring(6, 10);
        const monthBirth = this.idcard.substring(10, 12);
        const dayBirth = this.idcard.substring(12, 14);
        // 获取当前年月日并计算年龄
        const myDate = new Date();
        const monthNow = myDate.getMonth() + 1;
        const dayNow = myDate.getDate();
        let age = myDate.getFullYear() - yearBirth;

        if (
            monthNow < monthBirth ||
            (monthNow == monthBirth && dayNow < dayBirth)
        ) {
            age--;
        }

        return age;
    }
}

const idcard = new IDCard('500226199212130776');
console.log(idcard.getAge());
console.log(idcard.getSex());
console.log(idcard.getBirthday());
console.log(idcard.getInfo());
