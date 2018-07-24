// pages/component/list-of-city.js
const bmap = require('../../utils/libs/bmap-wx.min.js');
const { convertToPinyinUpper} =require('../../utils/toPinyin.js'); 
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    provinceData:Array,
    cityData:Array,
  },

  /**
   * 组件的初始数据
   */
  data: {
    height:0,
    currentPrev:'',
    currentNext:'',
    list:false,
    focus:false,
    listType:'province',
    listTypeDesp:{province:'省份',city:'城市'},
    selected:'',
  },
  attached:function(){
    const prev = wx.getStorageSync('currentPrev');
    const next = wx.getStorageSync('currentNext');
    if (next&&prev){
      this.setData({
        currentPrev: prev,
        currentNext: next,
      })
    }else{
      this._location();
    }
  },
  ready:function(){
    
  },

/**
 * 获取列表高度
 */

  
  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 逆解析坐标地址
     */
    _location () {
      let that = this;
      // 新建百度地图对象 
      let BMap = new bmap.BMapWX({
        ak: 'evPSi8T3yPlRpuZHwD8G2ST0OAa3jVek'
      });
      let fail = function (data) {
        console.log(data)
      };
      let success = function (data) {
        let dataSource = data.originalData.result.addressComponent;
        that.setData({
          currentPrev: dataSource.city,
          currentNext: dataSource.district,
        });
      }
      // 发起regeocoding检索请求 
      BMap.regeocoding({
        fail: fail,
        success: success,
      });
    },

    /**
     * 根据类型获取列表内容
     */
    _getData(type){
      const that = this;
      let url = 'http://route.showapi.com/268-2';
      let data = {
        showapi_appid: '63503',
      };
      switch (type){
      case 'city':
        url = 'http://route.showapi.com/268-3';
        data = { 
          ...data,
          proId:this.data.selected.id,
          showapi_sign:'b22d0d090df54b319e6c159e55cd3883',
          };
      break;
      case 'area':
        url = 'http://route.showapi.com/268-4';
      break;
      default:
        url = 'http://route.showapi.com/268-2';
        data = {
          ...data,
          showapi_sign: 'C5A5144C24D06013C12EC8417EE78CC4',
        }
      break;
      };
      wx.request({
        url,
        data,
        header: {},
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          console.log('请求', res)
          let response = res.data.showapi_res_body.list;
          if(type === 'province'){
            that.setData({provinceData:response})
          }else if(type==='city'){
          that.setData({ cityData: response })
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    },

    /**
     * input获取焦点显示搜索按钮
     */
    _searchFocus() {
      this.setData({ focus: true })
    },

    /**
     * input失去焦点隐藏搜索按钮
     */
    _searchBlur() {
      this.setData({ focus: false })
    },

    /**
     * 点击搜索 //todo````````````````````````````````````````````
     */
    _searchClick() {
      // this.setData({ focus: true })
    },
    /**
     * 选择城市按钮
     */
    _locationClick() {
      this._getTitleHeight();
      this.setData({list:true})
      this._getData('province');
    },
    /**
     * 获取城市列表数据
     */
    _getCityData(e){
      console.log(e)
      let selectData = e.target.dataset.selected;
      //this.setData({listType:'city'})
      if(this.data.listType!=='city'){        //当前选择的是省份则获取城市数据
        this.setData({ listType: 'city', selected: selectData }, () => {
          this._getData('city');
        })
      }else{ //当前选择城市则渲染当前城市
        this.setData({
          currentPrev: selectData.cityName || selectData.proName,
          currentNext: selectData.name,
          list:false,
          listType:'province',
        })
        wx.setStorage({
          key: 'currentPrev',
          data: selectData.cityName || selectData.proName,
        })
        wx.setStorage({
          key: 'currentNext',
          data: selectData.name,
        })
      }
    },
    /**
     * 获取高度
     */
    _getTitleHeight() {
      const that = this;
      let response = [];
      const query = wx.createSelectorQuery().in(this);
      query.select('.list-title').boundingClientRect().exec(function (res) {
        console.log(res)
        response = res[0].height;
        that._getContentHeight(response);
      })
    },
    _getContentHeight(response){
      const that = this;
      let height = 0;
      wx.getSystemInfo({
        success: function (res) {
          height = res.windowHeight - response;
          console.log('height', res.windowHeight, response);
          that.setData({ height })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    },
    _back(){
      if(this.data.listType==='province'){
        this.setData({list:false})
      }else{
        this.setData({listType:'province'})
        this._getData('province');
      }
    }
  },
})
