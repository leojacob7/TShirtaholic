const Product = require('../models/product');
const fs = require('fs');
const formidable = require('formidable');
const _ = require('lodash');
const path = require('path');
exports.getProductById = async (req, res, next, id) => {
	await Product.findById(id)
		.populate('category')
		.exec((err, product) => {
			if (err) {
				return res.status(400).json({
					error: 'Product not found',
				});
			}
			req.product = product;
			next();
		});
};

exports.createProduct = (req, res) => {
	const options = {
		maxFileSize: 2 * 1024 * 1024,
		multiple: true,
	};
	const form = formidable.IncomingForm();
	form.keepExtensions = true;
	form.parse(req, (err, fields, file) => {
		if (err || _.isEmpty(file)) {
			return res.status(400).json({
				error: 'Image could not be uploaded',
			});
		}
		let product = new Product(fields);

		if (file) {
			const { type, size, path } = file.photo;
			const oldPath = path;
			let newpath = __dirname + '/../assets/' + file.photo.name;
			product.photo.data = fs.readFileSync(path);
			product.photo.contentType = type;
			product.photo.size = size;
			fs.renameSync(oldPath, newpath);
			product.save((err, result) => {
				if (err) {
					return res.status(400).json({
						error: 'Product could not be saved',
					});
				}
				return res.json(result);
			});
		}
	});
};

exports.getProduct = (req, res) => {
	req.product.photo = undefined;
	return res.json(req.product);
};

exports.getPhoto = (req, res, next) => {
	if (req.product.photo.data) {
		res.set('Content-Type', req.product.photo.contentType);
		return res.send(req.product.photo.data);
	}
	next();
};

exports.updateProduct = (req, res) => {
	const form = formidable.IncomingForm();
	form.keepExtensions = true;
	console.log('here');
	form.parse(req, (err, fields, file) => {
		console.log('Came here');
		if (err) {
			return res.status(400).json({
				error: 'problem with image',
			});
		}
		//destructure the fields
		const { name, description, price, category, stocks } = fields;
		console.log('object :>> ', {
			name,
			description,
			price,
			category,
			stocks,
		});
		if (!name || !description || !price || !category || !stocks) {
			return res.status(400).json({
				error: 'Please include all fields',
			});
		}

		let product = req.product;
		product.name = name;
		product.description = description;
		product.price = price;
		product.category = category;
		product.stocks = stocks;

		if (file.photo) {
			if (file.photo.size > 3000000) {
				return res.status(400).json({
					error: 'File size too big!',
				});
			}
			product.photo.data = fs.readFileSync(file.photo.path);
			product.photo.contentType = file.photo.type;
		}
		console.log('here too');
		product.save((err, product) => {
			if (err) {
				res.status(400).json({
					error: 'Saving tshirt in DB failed',
				});
			}
			res.json(product);
		});
	});
};

exports.deleteProduct = async (req, res) => {
	const product = req.product;
	if (!product) {
		return res.status(404).json({ message: 'Product not found' });
	}
	await Product.findByIdAndRemove(product._id, (err, deletedProduct) => {
		if (err || _.isEmpty(deletedProduct)) {
			return res.status(404).json({
				message: `Product not found : ${err}`,
			});
		} else {
			deleteProduct.photo = undefined;
			return res.status(200).json({
				message: 'Product deleted',
				deletedProduct,
			});
		}
	});
};

exports.getAllProducts = async (req, res) => {
	let limit = parseInt(req.query) || 8;
	await Product.find({})
		.select('-photo')
		.limit(limit)
		.exec(function (err, products) {
			if (err || products.length === 0) {
			}
		});
};

exports.batchUpdateProducts = async (req, res) => {
	const { modifiedStocks } = req.body;
	const updateOperation = {
		stock: modifiedStocks,
	};
	await Product.updateMany({}, modifiedStocks, (err, allProducts) => {
		if (err) {
			return res.status(400).send('Could not modify the products');
		} else {
			return res.status(200).json({
				message: 'Updated Al products',
				allProducts,
			});
		}
	});
};

// TODO: get distinct categories by using Product.distinct
