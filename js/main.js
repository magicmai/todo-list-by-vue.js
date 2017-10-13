;(function () {
	'use strict';

	var Event = new Vue();
	var alert_sound = document.getElementById('alert-sound');

	function copy (obj) {
		return Object.assign({}, obj);
	}

	Vue.component('task', {
		template:'#task-tpl',
		props: ['todo'],
		methods: {
			action: function (name, params) {
				Event.$emit(name, params);
			}
		}
	})

	new Vue({
		el: '#main',

		data: {
			list: [],    // 存储每一条 todo
			current: {}  // 当前操作项，属性为 title、id、desc、alert_at
		},

		mounted: function () {
			var me = this;
			console.log('me', me);
			this.list = ms.get('list') || this.list;

			this.check_alerts();
			setInterval(function () {
				// console.log('this: ', this);  // Window
				me.check_alerts();
			}, 1000);

			Event.$on('remove', function(id) {
				// console.log('id: ', id);
				if (id) {
					me.remove(id);
				}
			});

			Event.$on('toggle_complete', function(id) {
				if (id) {
					me.toggle_complete(id);
				}
			});

			Event.$on('set_current', function(id) {
				if (id) {
					me.set_current(id);
				}
			});
		},

		methods: {

			check_alerts: function () {
				var me = this;
				this.list.forEach(function (row, i) {
					var alert_at = row.alert_at;
					if (!alert_at || row.alert_comfirmed) return;
					// console.log('alert_at: ', alert_at);

					var alert_at = (new Date(alert_at)).getTime();
					var now = (new Date()).getTime();  // 换成时间戳好计算

					if (now >= alert_at) {
						alert_sound.play();  // 为什么点击了确定后才发声?????
						var confirmed = confirm(row.title);
						Vue.set(me.list[i], 'alert_comfirmed', confirmed);
					}
				});
			},

			merge: function () {
				/************** 更新某项 **************/
				var is_update, id;
				is_update = id = this.current.id;				
				if (is_update) {
					console.log('this.current: ', this.current);
					var index = this.find_index(is_update);
					Vue.set(this.list, index, copy(this.current));

				} else {
				/************** 添加新项 **************/
					var title = this.current.title;
					if (!title && title !== 0) {       // title 为空不为 0
						return;
					}
					var todo = copy(this.current);     // {tiitle: '...', id: 1}
					todo.id = this.next_id();          // this.list.length + 1
					this.list.push(todo);              // [{}, ...]

					console.log('this.current: ', this.current);
					// console.log('todo: ', todo);
					// console.log('todo.id: ', todo.id);
					// console.log('this.list: ', this.list);				
				}
				this.reset_current();  // 清空输入框数据
			},
			
			/************** 删除新项 **************/
			remove: function (id) {
				var index = this.find_index(id);
				this.list.splice(index, 1);
			},

			next_id: function () {
				console.log('this.list: ', this.list);
				if (!this.list.length) {
					return this.list.length + 1;
				} else {
					return this.list[this.list.length-1].id + 1;  // 给每一项添加一个固定的 id，便于更新操作，但是删除了其中一项，再在 this.list.length 的基础上加一，会与别的项重复 id ?????????????????????
				}
			},

			set_current: function (todo) {
				this.current = copy(todo);
			},

			reset_current: function () {
				this.set_current({});
			},

			// 找到 item.id == id 的 index (索引)
			find_index: function (id) {  
				return this.list.findIndex (function (item) {
					return item.id == id;
				});
			},

			toggle_complete: function (id) {
				var i = this.find_index(id);
				Vue.set(this.list[i], 'completed', !this.list[i].completed);
			},

			toggle_detail: function () {
				var detail = document.getElementById('detail');
				var display = detail.style.display;
				if (display === 'none') {
					detail.style.display = "block";	
				} else {
					detail.style.display = "none";
				}
			}
		},

		watch: {
			list: {
				deep: true,
				handler: function (n, o) {  // new_value, old_value
					if (n) {
						ms.set('list', n);
					} else {
						ms.set('list', []);
					}
				},
			},
		},
	
	});

})();