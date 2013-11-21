define(["backbone", "underscore", "./data.text", "./data.map"], function(Backbone, _, TextDataView, MapDataView) {

	var DataView = Backbone.View.extend({
		initialize: function(options) {
			this.subViews = {
				"text": new TextDataView({ el: this.$('.text') }),
				"map": new MapDataView({ el: this.$('.map') })
			};

			this.originalData = {
				cities: (options.cities || []),
				events: (options.events || []),
				talks: (options.talks || []),
				users: (options.users || [])
			};

			_(this.subViews).each(function(subView) {
				subView.originalData = this.originalData;
			}, this);

			this.filterData();
			this.render();

			this.originalData.cities.on('activate desactivate', _(this.onCityChange).bind(this));
		},

		render: function() {
			if (this.subViews) {
				_(this.subViews).each(function(subView) {
					subView.render();
				});
			}
		},

		onCityChange: function(city) {
			this.filterData(city);
			this.render();
		},

		filterData: function(city) {
			if (!this.data) this.data = {};
			_(['Cities', 'Events', 'Talks', 'Organizers', 'Talkers', 'Attendees', 'Appearances']).each(function(type) {
				this.data[type.toLowerCase()] = this['filtered' + type](city);
			}, this);

			if (this.subViews) {
				_(this.subViews).each(function(subView) {
					subView.data = this.data;
				}, this);
			}
		},

		filteredCities: function(city) {
			return city ? [city.toJSON()] : this.originalData.cities.toJSON();
		},

		filteredEvents: function(city) {
			return city ? _(this.originalData.events.where({ city: city.get('id') })).map(function(ev) { return ev.toJSON(); }) : this.originalData.events.toJSON();
		},

		filteredTalks: function(city) {
			return city ? _(this.originalData.talks.where({ city: city.get('id') })).map(function(ta) { return ta.toJSON(); }) : this.originalData.talks.toJSON();
		},

		filteredOrganizers: function(city) {
			var cities = this.filteredCities(city);
			var organizerIds = _.uniq( _.flatten( _(cities).pluck('organizerIds') ) );
			return this.originalData.users.filter(function(user) {
				return _(organizerIds).contains(user.get('id'));
			});
		},

		filteredTalkers: function(city) {
			var talks = this.filteredTalks(city);
			var talkers = _(talks).pluck('authorId');
			return this.originalData.users.filter(function(user) {
				return _(talkers).contains(user.get('id'));
			});
		},

		filteredAttendees: function(city) {
			var events = this.filteredEvents(city);
			var attendeeIds = _.uniq( _.flatten( _(events).pluck('attendeeIds') ) );
			return this.originalData.users.filter(function(user) {
				return _(attendeeIds).contains(user.get('id'));
			});
		},

		filteredAppearances: function(city) {
			var events = this.filteredEvents(city);
			return _.reduce(events, function(memo, event) {
				return memo + event.attendeeIds.length;
			}, 0);
		}
	});
	return DataView;
});