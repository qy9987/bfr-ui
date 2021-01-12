<template>
  <div class="headerWrapper">
    <header ref="header" class="header">
      <div class="container">
        <h1>
          <router-link to="/">
            <!-- logo -->
            <slot>
              <img
                src="../assets/images/logo.png"
                alt="bfr-logo"
                class="nav-logo"
              >
            </slot>
          </router-link>
        </h1>

        <!-- nav -->
        <ul class="nav">
          <li v-show="isComponentPage" class="nav-item nav-algolia-search">
            <!-- <algolia-search /> -->
          </li>
          <li class="nav-item">
            <router-link
              active-class="active"
              to="/component"
            >
              组件
            </router-link>
          </li>
        </ul>
      </div>
    </header>
  </div>
</template>
<script>
// import AlgoliaSearch from './search.vue';

const version = '1.0.0'; // element version

export default {

  components: {
    // AlgoliaSearch,
  },
  data() {
    return {
      active: '',
      versions: [],
      version,
      verDropdownVisible: true,
    };
  },

  computed: {
    isComponentPage() {
      return /^component/.test(this.$route.name);
    },
  },
  methods: {
    switchVersion(version) {
      if (version === this.version) return;
      location.href = `${ location.origin }/${ this.versions[version] }/${ location.hash } `;
    },

    handleVerDropdownToggle(visible) {
      this.verDropdownVisible = visible;
    },
  },
};
</script>
<style lang="less" scoped>
  .headerWrapper {
    height: 60px;
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 1500;
  }

  .header {
    height: 60px;
    background-color: #fff;
    color: #fff;
    top: 0;
    left: 0;
    width: 100%;
    line-height: 60px;
    z-index: 100;
    position: relative;

    .container {
      height: 100%;
      box-sizing: border-box;
      border-bottom: 1px solid #DCDFE6;
    }

    .nav-lang-spe {
      color: #888;
    }

    h1 {
      margin: 0;
      float: left;
      font-size: 32px;
      font-weight: normal;

      a {
        color: #333;
        text-decoration: none;
        display: block;
      }

      span {
        font-size: 12px;
        display: inline-block;
        width: 34px;
        height: 18px;
        border: 1px solid rgba(255, 255, 255, .5);
        text-align: center;
        line-height: 18px;
        vertical-align: middle;
        margin-left: 10px;
        border-radius: 3px;
      }
    }

    .nav {
      float: right;
      height: 100%;
      line-height: 60px;
      background: transparent;
      padding: 0;
      margin: 0;
      &::before, &::after {
        display: table;
        content: "";
      }
      &::after {
        clear: both;
      }
    }

    .nav-gap {
      position: relative;
      width: 1px;
      height: 60px;
      padding: 0 20px;

      &::before {
        content: '';
        position: absolute;
        top: calc(50% - 8px);
        width: 1px;
        height: 16px;
        background: #ebebeb;
      }
    }

    .nav-logo {
      width: 55px;
      height: 55px;
    }

    .nav-logo,
    .nav-logo-small {
      vertical-align: sub;
    }

    .nav-logo-small {
      display: none;
    }

    .nav-item {
      margin: 0;
      float: left;
      list-style: none;
      position: relative;
      cursor: pointer;

      &.nav-algolia-search {
        cursor: default;
      }

      &.lang-item,
      &:last-child {
        cursor: default;
        margin-left: 34px;

        span {
          opacity: .8;
        }

        .nav-lang {
          cursor: pointer;
          display: inline-block;
          height: 100%;
          color: #888;

          &:hover {
            color: #409EFF;
          }
          &.active {
             font-weight: bold;
             color: #409EFF;
           }
        }
      }

      a {
        text-decoration: none;
        color: #1989FA;
        opacity: 0.5;
        display: block;
        padding: 0 22px;

        &.active,
        &:hover {
          opacity: 1;
        }

        &.active::after {
          content: '';
          display: inline-block;
          position: absolute;
          bottom: 0;
          left: calc(50% - 15px);
          width: 30px;
          height: 2px;
          background: #409EFF;
        }
      }
    }
  }

  @media (max-width: 850px) {
    .header {
      .nav-logo {
        display: none;
      }
      .nav-logo-small {
        display: inline-block;
      }
      .nav-item {
        margin-left: 6px;

        &.lang-item,
        &:last-child {
          margin-left: 10px;
        }

        a {
          padding: 0 5px;
        }
      }
      .nav-theme-switch, .nav-algolia-search {
        display: none;
      }
    }
  }

  @media (max-width: 700px) {
    .header {
      .container {
        padding: 0 12px;
      }
      .nav-item {
        a {
          font-size: 12px;
          vertical-align: top;
        }

        &.lang-item {
          height: 100%;

          .nav-lang {
            display: flex;
            align-items: center;

            span {
              padding-bottom: 0;
            }
          }
        }
      }
      .nav-gap {
        padding: 0 8px;
      }
    }
  }
</style>
