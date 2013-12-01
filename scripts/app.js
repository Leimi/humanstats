define(
	["json!../data/all.json", "./models", "./views/cities", "./views/data"],
	function(data, models, CitiesView, DataView) {

	var HumanStatistics = function(container) {
		container = document.querySelector(container);
		this.cities = new models.Cities(data.cities);
		this.events = new models.Events(data.events, { unfinished: false });
		this.talks = new models.Talks(data.talks);
		this.users = new models.Users(data.users);

		this.cities.setColors();
		this.users.setMainCities(this.events);

		this.citiesList = new CitiesView({
			collection: this.cities,
			el: container.querySelector('.cities-container')
		});
		this.dataView = new DataView({
			citiesCollection: this.cities,
			eventsCollection: this.events,
			talksCollection: this.talks,
			usersCollection: this.users,
			el: container.querySelector('.data-container')
		});
	};

	return HumanStatistics;
});