const mongoose = require('mongoose')
const Schema = mongoose.Schema

const singerListSchema = new Schema({
	id: String,
	title: String,
	singer_name: String,
	avatar: String,
	meta:{
		createdAt: {
			type: Date,
			default: Date.now()
		},
		upDateAt: {
			type: Date,
			default: Date.now()
		}
	}
})
// 保存之前的预处理
singerListSchema.pre('save', function () {
	if (this.isNew) {
		this.meta.createdAt = this.meta.upDateAt = Date.now()
	} else {
		this.meta.upDateAt = Date.now()
	}
})
// 发布模型
mongoose.model('singerList', singerListSchema)