<template>
  <div class="page-container page-component">
    <bfr-scrollbar class="page-component__nav">
      <side-nav :data="navsData" :base="`/component`" />
    </bfr-scrollbar>
    <div class="page-component__content">
      <div class="content-wrap">
        <router-view class="content" />
      </div>
      <bfr-scrollbar class="content-anchor">
        <a-anchor style="padding-left:10px" :get-container="getAnchorContainer">
          <a-anchor-link
            v-for="i in anchors"
            :key="i.href"
            :href="i.href"
            :title="i.title"
          />
        </a-anchor>
      </bfr-scrollbar>
    </div>
  </div>
</template>
<script>
import navsData from '../nav.config.json';

export default {
  beforeRouteUpdate(to, from, next) {
    next();
    setTimeout(() => {
      const toPath = to.path;
      const fromPath = from.path;
      if (toPath !== fromPath) {
        // document.documentElement.scrollTop = document.body.scrollTop = 0;
        this.renderAnchorHref();
      }
    }, 500);
  },
  data() {
    return {
      navsData,
      scrollTop: 0,
      showHeader: true,
      anchors: [],
    };
  },
  computed: {
    showBackToTop() {
      return !this.$route.path.match(/backtop/);
    },
  },
  watch: {
    '$route.path'() {
      this.anchors = [];
      setTimeout(()=>{
        this.renderAnchorHref();
      },500);
    },
  },
  mounted() {
    setTimeout(()=>{
      this.renderAnchorHref();
    },500);
    document.body.classList.add('is-component');
  },
  unmounted() {
    document.body.classList.remove('is-component');
  },

  methods: {
    getAnchorContainer() {
      return document.querySelector('.main-cnt__wrap');
    },
    renderAnchorHref() {
      const anchors = document.querySelector('.content-wrap').querySelectorAll('h2 a,h3 a,h4 a,h5 a,a');
      const basePath = location.href.split('#').splice(0, 2).join('#');
      [].slice.call(anchors).forEach(a => {
        const href = a.getAttribute('href');

        if(['H2','H3','H4','H5'].includes(a.parentElement.nodeName) || (href||'').substr(0,1)==='#' ) {
          a.href = basePath + href;
          if(['H3','H4','H5'].includes(a.parentElement.nodeName)) {
            this.anchors.push({ title: a.parentElement.innerText.substr(2), href: a.href });
          }
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.page-component__scroll {
  height: calc(100vh );
  padding-top: 60px;
  :deep > .bfr-scrollbar__wrap {
    overflow-x: auto;
  }
}

.page-component {
  box-sizing: border-box;
  height: 100%;

  &.page-container {
    padding: 0;
  }

  .page-component__nav {
    width: 240px;
    position: fixed;
    top: 60px;
    bottom: 0;
    padding-left: 20px;
    transition: padding-top .3s;

    :deep > .el-scrollbar__wrap {
      height: 100%;
      overflow-x: auto;
    }

    &.is-extended {
      padding-top: 0;
    }
  }

  .side-nav {
    height: 100%;
    padding-top: 20px;
    padding-bottom: 50px;
    padding-right: 0;

    & > ul {
      padding-bottom: 50px;
    }
  }

  .page-component__content {
    padding-left: 270px;
    box-sizing: border-box;
  }
  .content-wrap {
    min-height: 500px;
    margin-right: 240px;
  }
  .content-anchor {
    position: fixed;
    right: 20px;
    top: 80px;
    bottom: 20px;
    width: 200px;
    height: calc(100vh - 100px);
  }

  .content {
    padding-top: 50px;

    :deep > {
      h3 {
        margin: 55px 0 20px;
      }

      h4~table {
        border-collapse: collapse;
        width: 100%;
        background-color: #fff;
        font-size: 14px;
        // margin-bottom: 45px;
        line-height: 1.5em;

        strong {
          font-weight: normal;
        }

        td, th {
          border-bottom: 1px solid #dcdfe6;
          padding: 15px;
          max-width: 250px;
        }

        th {
          white-space: nowrap;
          color: #909399;
          font-weight: normal;
        }

        td {
          color: #606266;
        }

        th:first-child, td:first-child {
          padding-left: 10px;
        }
      }

      ul:not(.timeline) {
        margin: 10px 0;
        padding: 0 0 0 20px;
        font-size: 14px;
        color: #5e6d82;
        line-height: 2em;
      }
    }
  }
}

@media (max-width: 768px) {
  .page-component {
    .page-component__nav {
      width: 100%;
      position: static;
      margin-top: 0;
    }
    .side-nav {
      padding-top: 0;
      padding-left: 50px;
    }
    .page-component__content {
      padding-left: 10px;
      padding-right: 10px;
    }
    .content {
      padding-top: 0;
    }
    .content > table {
      overflow: auto;
      display: block;
    }
  }
}
</style>
