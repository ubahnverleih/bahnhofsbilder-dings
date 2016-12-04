/// <reference path="../dts/jquery.d.ts" />

$().ready(()=>{
	new App();
})

class App {
	constructor() {
		let query = `
			SELECT ?item ?itemLabel {
				?item wdt:P31 wd:Q728937.
				?item wdt:P17 wd:Q183
				SERVICE wikibase:label {
					bd:serviceParam wikibase:language "de", "en" .
				}
			}
		`
		let url = "https://query.wikidata.org/bigdata/namespace/wdq/sparql?format=json&query=" + encodeURI(query);
		$.get(url, (res)=>{
			let items = [];
			res['results']['bindings'].forEach((qitem)=>{
				let qid = qitem['item']['value'].split('/').slice(-1)[0];
				let label = qitem['itemLabel']['value'];
				items.push({id: qid, label: label});
			})
			this.renderLines(items);
		})
		$('#stationList').hide();
	}

	public renderLines(items: Object[]) {
		items.forEach((item)=>{
			let listitem = $('<li>').html(item['label']);
			listitem.click(() => {this.loadStations(item['id'])})
			$('#lineList').append(listitem);
		})
	}

	public loadStations(itemID) {
		let query = `
		SELECT ?item ?itemLabel ?image {
			?item wdt:P81 wd:`+itemID+`.
			OPTIONAL {?item wdt:P18 ?image}
			SERVICE wikibase:label {
				bd:serviceParam wikibase:language "de", "en".
			}
		}`
		let url = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql?format=json&query=' + encodeURI(query);
		$.get(url, (res)=>{
			let items = [];
			res['results']['bindings'].forEach((qitem)=>{
				let label = qitem['itemLabel']['value'];
				let image = qitem['image'] ? qitem['image']['value'] : "https://upload.wikimedia.org/wikipedia/commons/a/a5/Camera-photo_Upload-240px.png";
				items.push({image: image, label: label});
			})
			this.renderStations(items);
		})
	}

	public renderStations(items) {
		$('#stationList').html('');
		if (items.lenght == 0)
		{
			$('#stationList').html('no items found');
		}
		$('#stationList').show();
		items.forEach((item)=>{
			let listitem = $('<li>').html("<img src='"+ item['image'] +"?width=400' class='stationImage' /><p class='stationTitle'>" + item['label'] + "</p>");
			//listitem.click(() => {this.loadStations(item['id'])})
			$('#stationList').append(listitem);
		})
		let closebutton = $('<p id="closeButton">close</p>');
		closebutton.click(()=>{this.closeOverlay()})
		$('#stationList').append(closebutton);
	}

	public closeOverlay() {
		$('#stationList').hide();
	}
}