window.temporaryEffects = {};
localSavedEffects = localStorage.getItem("temporaryEffects");
if(localSavedEffects != undefined){	
	let localSaveData = JSON.parse(localSavedEffects);
	window.temporaryEffects = localSaveData;
}
else{
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
	window.temporaryEffects['Shield Spell'] = {
			name: 'Shield Spell',
			magicArmorMod: '5'
	}

}


function setArmorMagicBonus(feature){

	$(".ddbc-armor-class-box").click();
	$(`.ct-armor-manage-pane .ddbc-collapsible__header`).click();	
	let reactProps = getReactProps(`.ct-value-editor__property--2 .ct-value-editor__property-value input`);
	let currentValue = parseInt($(`.ct-value-editor__property--2 .ct-value-editor__property-value input`)[0][reactProps].value);
	
	currentValue = isNaN(currentValue) ?  0 : currentValue;
	
	$(`.ct-value-editor__property--2 .ct-value-editor__property-value input`)[0][reactProps].value = currentValue + parseInt(feature.magicArmorMod);
	$(`.ct-value-editor__property--2 .ct-value-editor__property-value input`)[0][reactProps].onBlur({target: $(`.ct-value-editor__property--2 .ct-value-editor__property-value input`)[0][reactProps]})
		
	reactProps = getReactProps(`.ct-value-editor__property--2 .ct-value-editor__property-source input`);
	
	$(`.ct-value-editor__property--2 .ct-value-editor__property-source input`)[0][reactProps].value += feature.name;
	$(`.ct-value-editor__property--2 .ct-value-editor__property-source input`)[0][reactProps].onBlur({target: $(`.ct-value-editor__property--2 .ct-value-editor__property-source input`)[0][reactProps]})
}

function removeArmorMagicBonus(feature){

	$(".ddbc-armor-class-box").click();
	$(`.ct-armor-manage-pane .ddbc-collapsible__header`).click();	

	let reactProps = getReactProps(`.ct-value-editor__property--2 .ct-value-editor__property-value input`);
	let currentValue = parseInt($(`.ct-value-editor__property--2 .ct-value-editor__property-value input`)[0][reactProps].value);
	currentValue = isNaN(currentValue) ?  0 : currentValue;

	$(`.ct-value-editor__property--2 .ct-value-editor__property-value input`)[0][reactProps].value = currentValue - parseInt(feature.magicArmorMod);
	$(`.ct-value-editor__property--2 .ct-value-editor__property-value input`)[0][reactProps].onBlur({target: $(`.ct-value-editor__property--2 .ct-value-editor__property-value input`)[0][reactProps]})
	
	reactProps = getReactProps(`.ct-value-editor__property--2 .ct-value-editor__property-source input`);

	$(`.ct-value-editor__property--2 .ct-value-editor__property-source input`)[0][reactProps].value = $(`.ct-value-editor__property--2 .ct-value-editor__property-source input`)[0].value.replace(feature.name, "");
	$(`.ct-value-editor__property--2 .ct-value-editor__property-source input`)[0][reactProps].onBlur({target: $(`.ct-value-editor__property--2 .ct-value-editor__property-source input`)[0][reactProps]})
}

function setSkillBonus(feature){

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
	}
}

function removeSkillBonus(feature){

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

	$('.ct-sidebar__pane-content').css('--sidebar-color', $('.ct-sidebar__pane-content').css('background'));
	let statusButton = "<div class='ct-primary-box__tab--extras ddbc-tab-list__nav-item statusEffects'>Status Effects</div>";
	$(".ct-character-header-desktop").append(statusButton);
	$('.ct-primary-box__tab--extras.statusEffects').off().on("click", function(){
		setTimeout(function(){	
			$(`.ct-initiative-box`).click();
			buildStatusButtons();
		}, 200)	
	});

	$('#site *:not(.ct-sidebar__pane *)').click(function() {
			$('#statusEffectsPanel').remove();	
	
	});
}

function buildStatusButtons(){
	let sidebarPanel = $(`<div id='statusEffectsPanel'></div>`);
	for(i in window.temporaryEffects){
		let cleanedFeatureName = i.replace(/[^A-Z0-9]/ig, "");
		let activeTrueFalse = (window.temporaryEffects[i].applied) ? true : false;
		let active = (activeTrueFalse) ? 'ddbc-toggle-field--is-enabled' : 'ddbc-toggle-field--is-disabled';

		let button = $(`
			<div class="ct-condition-manage-pane__condition-heading" data-name='${i}'>
				<div class="ct-condition-manage-pane__condition">
					<div class="ct-condition-manage-pane__condition-preview"></div>
					<div class="ct-condition-manage-pane__condition-name">
						${i}
					</div>
					<div class="ct-condition-manage-pane__condition-toggle">
						<div role="checkbox" tabindex="0" class="ddbc-toggle-field ${active} ddbc-toggle-field--is-interactive" aria-checked="${activeTrueFalse}" aria-label="Enable ${i}">
							<div class="ddbc-toggle-field__nub"></div>
						</div>
					</div>
				</div>
			</div>
		`);

		if($(`.ct-condition-manage-pane__condition-heading[data-name='${i}']`).length == 0)	
			sidebarPanel.append(button);
		
		if($('#statusEffectsPanel').length == 0)
			$(".ct-sidebar__pane-content").prepend(sidebarPanel);	
		

			
		$(button).off().on('click', function(){
			let feature = $(this).attr("data-name");
			$(`.ct-initiative-box`).click();
			//MAGIC ARMOR BUTTONS
			$(`.ct-condition-manage-pane__condition-heading[data-name='${feature}'] .ddbc-toggle-field`).toggleClass('ddbc-toggle-field--is-enabled');
			$(`.ct-condition-manage-pane__condition-heading[data-name='${feature}'] .ddbc-toggle-field`).toggleClass('ddbc-toggle-field--is-disabled');
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


			$('.statusEffects').click()
			let savedData = JSON.stringify(window.temporaryEffects);
			console.log('status saved', savedData);
			localStorage.setItem('temporaryEffects', savedData); 
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







