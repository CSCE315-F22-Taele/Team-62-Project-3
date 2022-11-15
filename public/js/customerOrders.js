const loadCategory = (category) => {
  let categoryItems = [];
	if (category === 1) {
		for(let item of items){
			if(item.categoryid === 1) {
				console.log("protein items: " + item.name)
				categoryItems = []
				categoryItems.concat(item.name)
			}
		}
	} else if (category === 2) {
		for(let item of items){
			if(item.categoryid === 2) {
				console.log("protein items: " + item.name)
				categoryItems = []
				categoryItems.concat(item.name)
			}
		}
	} else if (category === 3) {
		for(let item of items){
			if(item.categoryid === 3) {
				console.log("protein items: " + item.name)
				categoryItems = []
				categoryItems.concat(item.name)
			}
		}
	}
  return categoryItems;
}


function loadNewProduct(productDefId){
	let nextMenu = []
  productDef = getProductDef(productDefId);

	if (productDef.name == "Bowl") {
		nextMenu = loadCategory(1)
	} else if (productDef.name == "Gyro") {
		nextMenu = loadCategory(1);
	} else if (productDef.name == "Hummus and Pita") {
		console.log("Selected Hummus and Pita")
	} else if (productDef.name == "Two Falafels") {
		console.log("Selected Two Falafels")
	} else if (productDef == "Extra Protein") {
		console.log("Selected Extra Protein")
	} else if (productDef == "Extra Dressing") {
		console.log("Selected Extra Dressing") 
	} else if (productDef == "Fountain Drink") {
		console.log("Selected Fountain Drink")
	}
}