// import { getStyle } from 'element-plus/lib/utils/dom/index';

/* Vue全局指令 */
const directive = {
  /**超出隐藏 */
  showTip: {
    created(el, binding, vnode) {
      let tooltipNode = vnode.children.find((childCmpt) => childCmpt.component?.type.name == 'ElTooltip');
      if (tooltipNode) {
        el.addEventListener('mouseenter', () => {
          tooltipNode.component.props.disabled = true;
          tooltipNode.component.props.hideAfter = 0;
          const range = document.createRange();
          range.setStart(el, 0);
          range.setEnd(el, el.childNodes.length);
          const rangeWidth = Math.round(range.getBoundingClientRect().width);
          // const padding = (parseInt(getStyle(el, 'paddingLeft'), 10) || 0) + (parseInt(getStyle(el, 'paddingRight'), 10) || 0);
          const padding = 0;
          if (rangeWidth + padding > el.offsetWidth || el.scrollWidth > el.offsetWidth) {
            tooltipNode.component.props.disabled = false;
          }
        });
      }
    },
  },

  /**点击空白处指令 */
  clickOutside: {
    beforeMount(el, binding) {
      function clickHandler(e) {
        if (el.contains(e.target)) return false;
        if (binding.value) {
          binding.value(e);
        }
      }
      el.__vueClickOutside__ = clickHandler;
      document.addEventListener('click', clickHandler);
    },
    unmounted(el) {
      document.removeEventListener('click', el.__vueClickOutside__);
      delete el.__vueClickOutside__;
    },
  },

  /**
   * 权限指令。被设置的元素只会为有权限的角色展示
   * 例子： <el-button v-permission="['admin']>提交</el-button>
   * */
  permission: {
    mounted(el, bindObj) {
      let userInfo = JSON.parse(window.$Cookies.get('userInfo'));
      let permissionsList = JSON.parse(localStorage.getItem('buttonList')) || ['a:a:a']; // 获取账号在系统中的按钮权限
      let singleProjectPermissionsList = JSON.parse(localStorage.getItem('singleProjectRole')) || ['a:a:a']; // 获取账号在系统中的按钮权限
      if (userInfo.isAdmin && userInfo.isAdmin === true) {
        el.disabled = false;
      } else if (permissionsList || singleProjectPermissionsList) {
        if (!permissionsList.includes(bindObj.value) && !singleProjectPermissionsList.includes(bindObj.value)) {
          el.disabled = true;
          el.classList.add('is-disabled');
        }
      }
    },
  },

  /**
   * 点击预览
   */
  prview: {
    mounted(el, binding) {
      const { id, name } = binding.value;
      let fileType = name?.split('.')[1];
      el.addEventListener('click', () => {
        // addHandLog(binding);
        window.$api.commonApi.previewDoc({ oid: id }).then((res) => {
          var blob = new Blob([res], {
            type: fileType === 'pdf' ? 'application/pdf;chartset=UTF-8' : 'image/jpeg,image/png',
          });
          //新窗口打开
          var link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.target = '_blank';
          link.click();
        });
      });
    },
    // beforeUnmount(el, binding) {
    //   el.removeEventListener('click', () => {
    //     // addHandLog(binding);
    //     console.log(binding, 74);
    //   });
    // },
  },
};
export default directive;

// export { showTip, clickOutside, permissions };
