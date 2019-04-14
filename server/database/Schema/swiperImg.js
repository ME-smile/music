const mongoose = require('mongoose')
const Schema = mongoose.Schema

const swiperImgSchema = new Schema({
	imgsrc: String,
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
swiperImgSchema.pre('save', function () {
	if (this.isNew) {
		this.meta.createdAt = this.meta.upDateAt = Date.now()
	} else {
		this.meta.upDateAt = Date.now()
	}
})
// 发布模型
mongoose.model('swiperImg', swiperImgSchema)