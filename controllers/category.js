const { validationResult } = require('express-validator');
const Category = require('../models/category');

exports.getCategoryId = (req, res, next, id) => {
	Category.find({ _id: id }).exec((err, category) => {
		if (err) {
			return res.status(400).json(error);
		}
		req.category = category;
		next();
	});
};

exports.createCategory = (req, res) => {
	const { name } = req.body;

	const newCategory = new Category(req.body);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const { msg, param } = errors.array()[0];
		return res.status(400).json({ errors: `${param}: ${msg}` });
	}

	return newCategory.save((err, category) => {
		if (err) {
			return res.status(400).json({
				error: `Error : ${err}`,
			});
		}
		res.json(category);
	});
};

exports.getCategories = (req, res) => {
	Category.find({}).exec((err, category) => {
		if (err) {
			return res
				.status(400)
				.json({ error: `Error No category found: ${err}` });
		}
		res.json(category);
	});
};

exports.getCategoryById = (req, res) => {
	const { categoryId } = req.params;
	Category.find({ _id: categoryId }).exec((err, category) => {
		if (err || category.length === 0) {
			return res
				.status(400)
				.json({ error: `Error No category found: ${err}` });
		}
		res.json(category);
	});
};

exports.updateCategory = (req, res) => {
	const { category } = req;
	const { categoryId } = req.params;
	const query = { _id: categoryId };
	console.log('category', category);
	const update = {
		$set: req.body,
	};

	const options = {
		useFindAndModify: false,
		new: true,
	};
	Category.findByIdAndUpdate(
		query,
		update,
		options,
		(err, updatedCategory) => {
			if (err || updatedCategory === null) {
				console.log('here');
				return res.status(400).json({ error: `Error: ${err}` });
			}
			return res.json(updatedCategory);
		}
	);
};

exports.deleteCategory = (req, res) => {
	const { categoryId } = req.params;
	Category.findByIdAndRemove(categoryId, (err, category) => {
		if (err) {
			return res.status(400).json({ error: `Error: ${err}` });
		}
		return res.json({
			message: 'Category deleted successfully',
			category,
		});
	});
};
