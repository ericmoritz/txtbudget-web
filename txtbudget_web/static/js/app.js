require("babel/register");
var React = require("react");
var HydraClient = require("../lib/hydra/utils/HydraClient");
var HydraController = require("../lib/hydra/components/HydraController");
var IndexComponent = require("./components/Index");
var TransactionsComponent = require("./components/Transactions");

window.React = React

// HydraClient handle the navigation of the hydra service
HydraClient.init("/service"); 

React.render(
    React.createElement(
	HydraController,
	{
	    components: {
		"http://rdf.vocab-ld.org/vocabs/txtbudget.jsonld#Index": IndexComponent,
		"http://rdf.vocab-ld.org/vocabs/txtbudget.jsonld#Transactions": TransactionsComponent
	    }
	}
    ),
    document.body
);

