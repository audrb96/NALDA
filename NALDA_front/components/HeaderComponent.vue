<template>
  <div class="header-container">
    <div class="space-wrap"></div>
    <div class="header-container-image">
      <img src="/logo.png" @click="MoveMain" />
    </div>
    <div class="header-container-userprofile">
      <div class="profile-back">
        <img class="previous-icon" src="/main/previous.png" alt @click="Movefrom" />
      </div>
      <div class="profile-img" @click="MoveMypage">
        <img src="/main/user_profile_w.png" alt="profile-img" />
      </div>

      <div class="mr-3 profile-name" @click="MoveMypage">{{ fullname }}</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'HeaderComponent',
  computed: {
    ...mapGetters('user', ['isLogin']),
    ...mapState('user', ['loginMember']),
    fullname() {
      if (this.loginMember == null) return '비회원'
      let fullname = ''
      this.loginMember.fullName.lastName &&
        (fullname += this.loginMember.fullName.lastName)
      this.loginMember.fullName.middleName &&
        (fullname += this.loginMember.fullName.middleName)
      this.loginMember.fullName.firstName &&
        (fullname += this.loginMember.fullName.firstName)
      return fullname
    },
  },
  methods: {
    MoveMain() {
      if (this.loginMember?.userRole === 'ROLE_USER') {
        this.$router.push('/main')
      } else if (this.loginMember?.userRole === 'ROLE_ATTENDANT') {
        this.$router.push('/attendant/main')
      } else {
        this.$router.push('/login')
      }
    },
    MoveSignup() {
      this.$router.push('user/signup')
    },
    MoveMypage() {
      if (this.loginMember != null) {
        this.$router.push('/user/mypage')
      } else {
        this.$router.push('/login')
      }
    },
    Movefrom() {
      this.$router.push(this.$nuxt.context.from.path)
    },
  },
}
</script>

<style scoped>
@font-face {
  font-family: 'twayfly';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_tway@1.0/twayfly.woff')
    format('woff');
  font-weight: normal;
  font-style: normal;
}

* {
  font-family: 'twayfly';
}
.header-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 15vh;
  background-color: rgb(69, 169, 200);
}
.space-wrap {
  width: 18%;
}

.header-container-blank {
  width: 30%;
}
.header-container-image {
  width: 64%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header-container-image img {
  width: 15%;
  cursor: pointer;
}

.header-container-userprofile {
  width: 18%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: azure;
  cursor: pointer;
}

.profile-back {
  height: 100%;
  width: 20%;
}
.previous-icon {
  width: 80%;
  height: 100%;
}

.profile-img {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.profile-img img {
  width: 55%;
  height: 55%;
}

.profile-name {
  width: 40%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 30px;
}
</style>
