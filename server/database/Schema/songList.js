const mongoose = require('mongoose')
const Schema = mongoose.Schema

const songListSchema = new Schema({
	img_src: String,
	song_desc: String,
	song_type: String,
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
songListSchema.pre('save', function () {
	if (this.isNew) {
		this.meta.createdAt = this.meta.upDateAt = Date.now()
	} else {
		this.meta.upDateAt = Date.now()
	}
})
// 发布模型
mongoose.model('songList', songListSchema)