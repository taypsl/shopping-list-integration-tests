const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);


describe('Recipes', function() {
	before(function() {
		return runServer;
	});

	after(function() {
		return closeServer;
	});

	it('should list recipes on GET', function() {
		return chai.request(app)
			.get('/recipes')
			.then(function(res) {
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.a('array');
				res.body.length.should.be.at.least(1);

				const expectedKeys = ['id', 'name', 'ingredients'];
				res.body.forEach(function(recipe) {
					recipe.should.be.a('object');
					recipe.should.include.keys(expectedKeys);
				});
			});
	});

	it('should add an item on POST', function() {
	    const newRecipe = {name: 'chocolate milk', ingredients: ['milk', 'chocolate']};
	    return chai.request(app)
	      	.post('/recipes')
	      	.send(newRecipe)
	      	.then(function(res) {
		      	res.should.have.status(201);
		        res.should.be.json;
		        res.body.should.be.a('object');
		        res.body.should.include.keys('id', 'name', 'ingredients');
		        res.body.id.should.not.be.null;

		        res.body.should.deep.equal(Object.assign(newRecipe, {id: res.body.id}));
	      	});
	  	});

	it('should update items on PUT', function() {
	    const updateData = {
	      name: 'chocolate milk',
	      ingredients: ['whole milk', 'chocolate']
	    };

	    return chai.request(app)
	      // first have to get so we have an idea of object to update
	      	.get('/recipes')
	      	.then(function(res) {
	        	updateData.id = res.body[0].id;

	        	return chai.request(app)
	          	.put(`/recipes/${updateData.id}`)
	          	.send(updateData);
	      	})

	      	.then(function(res) {
		        res.should.have.status(200);
		        res.should.be.json;
		        res.body.should.be.a('object');
		        res.body.should.deep.equal(updateData);
	      	});
  	});

  	it('should delete items on DELETE', function() {
    	return chai.request(app)
     	.get('/recipes')
      	.then(function(res) {
        	return chai.request(app)
        	.delete(`/recipes/${res.body[0].id}`);
      	})
      	.then(function(res) {
        	res.should.have.status(204);
      	});
  	});

})