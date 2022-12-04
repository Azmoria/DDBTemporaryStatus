window.temporaryEffects = {};
window.temporaryEffects['Mage Armor'] = {
		name: 'Mage Armor',
		magicArmorMod: '3'
	}
window.temporaryEffects['Pass without a Trace'] = { 
		name: 'Pass without a Trace',
		skillMod: {
			Stealth: '10'
		},
}




function setArmorMagicBonus(feature){
	$(`.ct-character-sheet`).click();
	$(".ddbc-armor-class-box").click();
	$(`.ct-skill-pane .ddbc-collapsible__header`).click();	
	let reactProps = getReactProps(`.ct-value-editor__property--24 .ct-value-editor__property-value input`);
	let currentValue = parseInt($(`.ct-value-editor__property--24 .ct-value-editor__property-value input`)[0][reactProps].value);
	
	currentValue = isNaN(currentValue) ?  0 : currentValue;
	
	$(`.ct-value-editor__property--24 .ct-value-editor__property-value input`)[0][reactProps].value = currentValue + parseInt(feature.magicArmorMod);
	$(`.ct-value-editor__property--24 .ct-value-editor__property-value input`)[0][reactProps].onBlur({target: $(`.ct-value-editor__property--24 .ct-value-editor__property-value input`)[0][reactProps]})
		
	reactProps = getReactProps(`.ct-value-editor__property--24 .ct-value-editor__property-source input`);
	
	$(`.ct-value-editor__property--24 .ct-value-editor__property-source input`)[0][reactProps].value += feature.name;
	$(`.ct-value-editor__property--24 .ct-value-editor__property-source input`)[0][reactProps].onBlur({target: $(`.ct-value-editor__property--24 .ct-value-editor__property-source input`)[0][reactProps]})
	$(`.ct-character-sheet`).click();
}

function removeArmorMagicBonus(feature){
	$(`.ct-character-sheet`).click();
	$(".ddbc-armor-class-box").click();
	$(`.ct-armor-manage-pane .ddbc-collapsible__header`).click();	

	let reactProps = getReactProps(`.ct-value-editor__property--2 .ct-value-editor__property-value input`);
	let currentValue = parseInt($(`.ct-value-editor__property--2 .ct-value-editor__property-value input`)[0][reactProps].value);
	currentValue = isNaN(currentValue) ?  0 : currentValue;

	$(`.ct-value-editor__property--24 .ct-value-editor__property-value input`)[0][reactProps].value = currentValue - parseInt(feature.magicArmorMod);
	$(`.ct-value-editor__property--24 .ct-value-editor__property-value input`)[0][reactProps].onBlur({target: $(`.ct-value-editor__property--2 .ct-value-editor__property-value input`)[0][reactProps]})
	
	reactProps = getReactProps(`.ct-value-editor__property--2 .ct-value-editor__property-source input`);

	$(`.ct-value-editor__property--24 .ct-value-editor__property-source input`)[0][reactProps].value = $(`.ct-value-editor__property--2 .ct-value-editor__property-source input`)[0].value.replace(feature.name, "");
	$(`.ct-value-editor__property--24 .ct-value-editor__property-source input`)[0][reactProps].onBlur({target: $(`.ct-value-editor__property--2 .ct-value-editor__property-source input`)[0][reactProps]})
	$(`.ct-character-sheet`).click();
}

function setSkillBonus(feature){
	$(`.ct-character-sheet`).click();
	for(skill in feature.skillMod){
		$(`.ct-skills__col--skill:contains(${skill})`).click();
		$(`.ct-skill-pane .ddbc-collapsible__header`).click();	
		
		let reactProps = getReactProps(`.ct-value-editor__property--24 .ct-value-editor__property-value input`);
		let currentValue = parseInt($(`.ct-value-editor__property--24 .ct-value-editor__property-value input`)[0][reactProps].value);
		currentValue = isNaN(currentValue) ?  0 : currentValue;
		
		$(`.ct-value-editor__property--24 .ct-value-editor__property-value input`)[0][reactProps].value = currentValue + parseInt(feature.skillMod[skill]);
		$(`.ct-value-editor__property--24 .ct-value-editor__property-value input`)[0][reactProps].onBlur({target: $(`.ct-value-editor__property--24 .ct-value-editor__property-value input`)[0][reactProps]})
		
		reactProps = getReactProps(`.ct-value-editor__property--24 .ct-value-editor__property-source input`);
		
		$(`.ct-value-editor__property--24 .ct-value-editor__property-source input`)[0][reactProps].value += feature.name;
		$(`.ct-value-editor__property--24 .ct-value-editor__property-source input`)[0][reactProps].onBlur({target: $(`.ct-value-editor__property--24 .ct-value-editor__property-source input`)[0][reactProps]})
		$(`.ct-character-sheet`).click();
	}
}

function removeSkillBonus(feature){
	$(`.ct-character-sheet`).click();
	for(skill in feature.skillMod){
		$(`.ct-skills__col--skill:contains(${skill})`).click();
		$(`.ct-skill-pane .ddbc-collapsible__header`).click();	
		
		let reactProps = getReactProps(`.ct-value-editor__property--24 .ct-value-editor__property-value input`);
		let currentValue = parseInt($(`.ct-value-editor__property--24 .ct-value-editor__property-value input`)[0][reactProps].value);
		
		currentValue = isNaN(currentValue) ?  0 : currentValue;
		
		$(`.ct-value-editor__property--24 .ct-value-editor__property-value input`)[0][reactProps].value = currentValue - parseInt(feature.skillMod[skill]);
		$(`.ct-value-editor__property--24 .ct-value-editor__property-value input`)[0][reactProps].onBlur({target: $(`.ct-value-editor__property--24 .ct-value-editor__property-value input`)[0][reactProps]})
		
		reactProps = getReactProps(`.ct-value-editor__property--24 .ct-value-editor__property-source input`);
		
		$(`.ct-value-editor__property--24 .ct-value-editor__property-source input`)[0][reactProps].value = $(`.ct-value-editor__property--24 .ct-value-editor__property-source input`)[0].value.replace(feature.name, "");
		$(`.ct-value-editor__property--24 .ct-value-editor__property-source input`)[0][reactProps].onBlur({target: $(`.ct-value-editor__property--24 .ct-value-editor__property-source input`)[0][reactProps]})
		$(`.ct-character-sheet`).click();
	}

	
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
		let button = $(`<button id='button_${cleanedFeatureName}' data-name='${i}'>${i}</button>`);
		$(".ct-sidebar__pane-content").append(button);		
			
		$(button).off().on('click', function(){
			let feature = $(this).attr("data-name");
			
			//MAGIC ARMOR BUTTONS
			if(window.temporaryEffects[feature].applied && window.temporaryEffects[feature]['magicArmorMod'] != undefined){
				removeArmorMagicBonus(window.temporaryEffects[feature]);
				delete window.temporaryEffects[feature].applied;
			}
			else if(window.temporaryEffects[feature]['magicArmorMod'] != undefined){
				setArmorMagicBonus(window.temporaryEffects[feature]);
				window.temporaryEffects[feature].applied = true;
			}

			if(window.temporaryEffects[feature].applied && window.temporaryEffects[feature]['skillMod'] != undefined){
				removeSkillBonus(window.temporaryEffects[feature]);
				delete window.temporaryEffects[feature].applied;
			}
			else if(window.temporaryEffects[feature]['skillMod'] != undefined){
				setSkillBonus(window.temporaryEffects[feature]);
				window.temporaryEffects[feature].applied = true;
			}
		});

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





