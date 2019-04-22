const mongoose = require('mongoose')
const Schema = mongoose.Schema
const songSchema = new Schema({
	id: Number,
	mid: String,
	singerID: String,
	singer: String,
	name: String,
	album: String,
	duration: Number,
	image: String,
	url: String,  // 播放地址
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
songSchema.pre('save', function () {
	if (this.isNew) {
		this.meta.createdAt = this.meta.upDateAt = Date.now()
	} else {
		this.meta.upDateAt = Date.now()
	}
})
mongoose.model('song',songSchema)