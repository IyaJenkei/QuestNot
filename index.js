var state = {
	javascriptDate: null,
	searchclick: null,
	accountID: null,
	accessToken: null
};

(function () {
	$.getJSON('https://api.stackexchange.com/2.2/tags?order=desc&sort=popular&site=stackoverflow', this.populateTopTags);
})();

function populateTopTags(data) {
	for (i = 0; i < data.items.length; i++) {
		$('.top-tags-panel').append(`<div class="btn btn-info top-tags">` + data.items[i].name + `</div>`);
	}
	$('.top-tags').click(handleTagClick);
}

function handleTagClick(event) {
	var target = $(event.currentTarget);
	if (target.hasClass('top-tags-clicked')) {
		target.removeClass('top-tags-clicked');
	}
	else {
		target.addClass('top-tags-clicked').siblings().removeClass('top-tags-clicked');
	}

	state.searchclick = $('.top-tags-clicked').text();
	state.javascriptDate = Math.floor((Date.now() + (-5 * 60 * 60 * 1000)) / 1000);
	callAPI();
}

function callAPI() {
	$(".search-results").empty();
	var response = null;
	//use a for loop to append in multiple search tags
	$.getJSON(`https://api.stackexchange.com/2.2/search/advanced?order=desc&min=${state.javascriptDate.toString()}&sort=activity&q=${state.searchclick}&site=stackoverflow`, appendResults);
}

function appendResults(response) {
	let list = $(".search-results");
	console.log(response);
	for (i = 0; i < response.items.length; i++) {
		list.append(`
			<tr class="answer row"><td class="col-md-1"><a class="btn btn-default close-icon"></a></td>
				<td class="col-md-11"><a href="` + response.items[i].link + `?access_token=` + state.accessToken + `" target="_blank" class="result-link">` + response.items[i].title + `</a></td>
			</tr>`);
	};
	
	setTimeout(callAPI, 60000);
	
	$('.close-icon').click(function (event) {
		$(event.currentTarget).parents()[1].remove();
	});
}

$('#login-button').click(function () {
	$(".main-panel").removeClass("hidden");
	$(".first-panel").addClass("hidden");
});
