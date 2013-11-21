define({
	//https://groups.google.com/forum/#!msg/d3-js/WC_7Xi6VV50/j1HK0vIWI-EJ
	transitionEndAll: function(transition, callback) {
		var n = 0;
		transition
			.each(function() { ++n; })
			.each("end", function() { if (!--n) callback.apply(this, arguments); });
	}
});