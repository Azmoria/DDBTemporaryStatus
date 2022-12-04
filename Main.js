window.temporaryEffects = [];
window.temporaryEffects['Mage Armor'] = 
	{
		name: 'Mage Armor',
		baseArmorMod: '3'	
	}



function setArmorMagicBonus(feature){
	$(`.ct-character-sheet`).click();
	$(".ddbc-armor-class-box").click();
	$(`.ct-armor-manage-pane .ddbc-collapsible__header`).click();	
	let reactProps = getReactProps(`.ct-value-editor__property--2 .ct-value-editor__property-value input`);
	let currentValue = parseInt($(`.ct-value-editor__property--2 .ct-value-editor__property-value input`)[0][reactProps].value);
	$(`.ct-value-editor__property--2 .ct-value-editor__property-value input`)[0][reactProps].value = currentValue + parseInt(feature.baseArmorMod);
	$(`.ct-value-editor__property--2 .ct-value-editor__property-value input`)[0][reactProps].onBlur({target: $(`.ct-value-editor__property--2 .ct-value-editor__property-value input`)[0][reactProps]})
	reactProps = getReactProps(`.ct-value-editor__property--2 .ct-value-editor__property-source input`);
	$(`.ct-value-editor__property--2 .ct-value-editor__property-source input`)[0][reactProps].value += feature.name;
	$(`.ct-value-editor__property--2 .ct-value-editor__property-source input`)[0][reactProps].onBlur({target: $(`.ct-value-editor__property--2 .ct-value-editor__property-source input`)[0][reactProps]})
	$(`.ct-character-sheet`).click();
}

function removeArmorMagicBonus(feature){
	$(`.ct-character-sheet`).click();
	$(".ddbc-armor-class-box").click();
	$(`.ct-armor-manage-pane .ddbc-collapsible__header`).click();	
	let reactProps = getReactProps(`.ct-value-editor__property--2 .ct-value-editor__property-value input`);
	let currentValue = parseInt($(`.ct-value-editor__property--2 .ct-value-editor__property-value input`)[0][reactProps].value);
	$(`.ct-value-editor__property--2 .ct-value-editor__property-value input`)[0][reactProps].value = currentValue - parseInt(feature.baseArmorMod);
	$(`.ct-value-editor__property--2 .ct-value-editor__property-value input`)[0][reactProps].onBlur({target: $(`.ct-value-editor__property--2 .ct-value-editor__property-value input`)[0][reactProps]})
	reactProps = getReactProps(`.ct-value-editor__property--2 .ct-value-editor__property-source input`);
	$(`.ct-value-editor__property--2 .ct-value-editor__property-source input`)[0][reactProps].value = $(`.ct-value-editor__property--2 .ct-value-editor__property-source input`)[0].value.replace(feature.name, "");
	$(`.ct-value-editor__property--2 .ct-value-editor__property-source input`)[0][reactProps].onBlur({target: $(`.ct-value-editor__property--2 .ct-value-editor__property-source input`)[0][reactProps]})
	$(`.ct-character-sheet`).click();
}
function getReactProps(selector){
	for(i in $(selector)[0])
	{
	    if(i.startsWith("__reactProps")){
	    		return i;
	    }
	}
}
function buildStatus(){
	let statusButton = "<div class='ct-primary-box__tab--extras ddbc-tab-list__nav-item statusEffects'>Status Effects</div>";
	$(".ct-character-header-desktop").append(statusButton);
	$('.ct-primary-box__tab--extras.statusEffects').off().on("click", function(){
		setTimeout(function(){		
			$('.ddbc-armor-class-box').click();

			$(".ct-sidebar__pane-content").empty();
			buildStatusButtons();
		}, 100)
	
	});   	
}
function buildStatusButtons(){
	for(i in window.temporaryEffects){
		let cleanedFeatureName = i.replace(/[^A-Z0-9]/ig, "");
		let button = $(`<button id='button_${cleanedFeatureName}'>${i}</button>`);
		$(".ct-sidebar__pane-content").append(button);		
		if(i == 'Mage Armor'){
			$(button).off().on('click', function(){
				if(window.temporaryEffects['Mage Armor'].applied){
					removeArmorMagicBonus(window.temporaryEffects['Mage Armor']);
					delete window.temporaryEffects['Mage Armor'].applied;
				}
				else{
					setArmorMagicBonus(window.temporaryEffects['Mage Armor']);
					window.temporaryEffects['Mage Armor'].applied = true;
				}
				
				console.log("CLICK!!!!!");
			})
		}
	}
}


let observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (!mutation.addedNodes) return

    for (let i = 0; i < mutation.addedNodes.length; i++) {
      // do things to your newly added nodes here
      let node = mutation.addedNodes[i]
      if (node.className == 'ct-character-sheet-desktop'){
      	buildStatus();
      	observer.disconnect();
      }
    }
  })
})

observer.observe(document.body, {
    childList: true
  , subtree: true
  , attributes: false
  , characterData: false
})





