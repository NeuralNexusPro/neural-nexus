class ShellHeadeResize {
  current: any;
  lastShowList: any;
  menuList: any;
  moreId: any;
  searchInputWidth: any;
  showHideList: any;
  startList: any;
  constructor(props: any) {
    this.lastShowList = props.lastShowList; // 最后剩余显示的
    this.showHideList = props.showHideList; // 倒着隐藏，顺着展示
    this.startList = props.startList; // 所有的icon id,除了更多 J
    this.moreId = props.moreId;
    this.current = null;
    this.menuList = null;
    this.searchInputWidth = props.searchInputWidth;
  }

  getMenuList() {
    return this.menuList;
  }

  getElementByIdObj(key: any) {
    this.current = key;
    return document.getElementById(key);
  }

  setAddClass(arrays: any) {
    arrays.map(
      // @ts-expect-error TS(2531): Object is possibly 'null'.
      (key: any) => !this.getElementByIdObj(key).classList.contains('hide') && this.getElementByIdObj(key).classList.add('hide')
    );
  }

  setRemoveClass(arrays: any) {
    arrays.map(
      // @ts-expect-error TS(2531): Object is possibly 'null'.
      (key: any) => this.getElementByIdObj(key).classList.contains('hide') && this.getElementByIdObj(key).classList.remove('hide')
    );
  }

  handleResize(resizeStyle: any, searchInputBol: any) {
    const { leftMenuInitWidth, rightItemCount } = resizeStyle;
    if (rightItemCount === 0) {
      return;
    }
    let rightMenuWidth = 0; // 右边逻辑宽度，实时变化
    let leftMenuWidth = 0; // 左边逻辑宽度，实时变化
    const menuItemWidth = 42; // menu item 宽度
    let leftHideValue = 0; // 处理左边逻辑最小值 包含了input 642=42*8+304
    leftHideValue = (rightItemCount - 2) * menuItemWidth + this.searchInputWidth - this.searchInputWidth; // Note 要调试临界值在这里
    const _searchInputWidth = this.searchInputWidth;
    const screenWidth = document.body.clientWidth; // 当前屏幕宽度
    // 头部菜单总宽度 - padding 16px
    const headerWidth =
      // @ts-expect-error TS(2531): Object is possibly 'null'.
      document.getElementById('shellheader-container').clientWidth - (screenWidth > leftHideValue ? 32 : 16);
    // Note: 增加中间组件
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    const _centerMenu = document.getElementById('centerMenu') ? document.getElementById('centerMenu').clientWidth : 0;
    const _rightMenuWidth = headerWidth - leftMenuInitWidth - _centerMenu; // 右边宽度
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    const leftClassList = this.getElementByIdObj('leftMenu').classList;

    // 宽度小于600px
    if (screenWidth <= leftHideValue) {
      // 有搜索框
      if (searchInputBol) {
        // 隐藏左边
        leftClassList.add('hide');
        // 屏幕宽度 - 16padding - _searchInputWidth搜索框
        rightMenuWidth = screenWidth - 16 - _searchInputWidth; // - 36 add 36 为了空出搜索菜单的ICON位置
        this.moveHandle(rightMenuWidth, menuItemWidth, rightItemCount);
      } else {
        // 无搜索框，显示左边
        leftClassList.remove('hide');
        // 右边固定模式显示
        // 隐藏 ['F', 'E', 'G', 'H', 'I', 'L', 'K']
        // 显示 ['J']
        this.setAddClass(this.showHideList); // 倒着隐藏，顺着展示
        this.setRemoveClass(this.lastShowList); // 最后剩余显示的

        // 存储menuList
        // 数组用来标记后续更多展示时使用
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        const rights = this.getElementByIdObj('rightMenu').childNodes;
        const g = [];
        for (let i = 0, pl = rights.length; i < pl; i++) {
          g.push({
            // @ts-expect-error TS(2339): Property 'id' does not exist on type 'ChildNode'.
            id_name: rights[i].id,
            // @ts-expect-error TS(2339): Property 'classList' does not exist on type 'Child... Remove this comment to see the full error message
            type: rights[i].classList.contains('hide') ? 'remove' : 'add',
          });
        }
        this.menuList = g;
      }
    } else {
      // 宽度大于600px
      // 有搜索框
      if (searchInputBol) {
        leftMenuWidth = headerWidth - (676 - 210);
        if (leftMenuWidth < leftMenuInitWidth - _centerMenu) {
          // 阈值不够 依然隐藏保持不变
          leftClassList.add('hide');
          rightMenuWidth = headerWidth - _searchInputWidth;
        } else {
          leftClassList.remove('hide');
          rightMenuWidth = _rightMenuWidth - _searchInputWidth;
        }
        this.moveHandle(rightMenuWidth, menuItemWidth, rightItemCount);
      } else {
        // 无搜索框，做动态显示逻辑
        rightMenuWidth = headerWidth - leftMenuInitWidth - _centerMenu;
        leftClassList.remove('hide');
        this.moveHandle(rightMenuWidth, menuItemWidth, rightItemCount);
      }
    }
    // this.btnInputClass = this.btnInputClass.replace('autowidth', '');
  }

  moveHandle(rightMenuWidth: any, menuItemWidth: any, rightItemCount: any) {
    // 根据宽度和数量计算当前展示个数
    // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
    const displayItem = Number.parseInt((rightMenuWidth + 16) / menuItemWidth, 10);
    // 最大宽度，都展示，其他隐藏 ,-1是“更多ICON”
    if (displayItem >= rightItemCount - 1) {
      this.setAddClass([this.moreId]);
      this.setRemoveClass(this.startList);
    } else {
      // 数组越靠前优先级越高
      const nodeArr = [this.moreId, ...this.startList];
      // 数组用来标记后续更多展示时使用
      const valueArr = [];
      const addArr = []; // 移除hide
      const removeArr = []; // 添加hide
      for (let index = 0; index < rightItemCount; index++) {
        if (index < displayItem) {
          valueArr.push({ id_name: nodeArr[index], type: 'add' });
          addArr.push(nodeArr[index]);
          // this.getElementByIdObj(nodeArr[index]).classList.remove('hide');
        } else {
          valueArr.push({ id_name: nodeArr[index], type: 'remove' });
          removeArr.push(nodeArr[index]);
          // this.getElementByIdObj(nodeArr[index]).classList.add('hide');
        }
      }
      this.setAddClass(removeArr);
      this.setRemoveClass(addArr);
      this.menuList = valueArr;
    }
  }
}

export default ShellHeadeResize;
