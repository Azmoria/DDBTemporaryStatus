window.temporaryEffects = {};

localSavedEffects = localStorage.getItem("temporaryEffects");
if(localSavedEffects != undefined){	
	let localSaveData = JSON.parse(localSavedEffects);
	for(effect in localSaveData){
		if(localSaveData[effect].applied != undefined){
			window.temporaryEffects[effect] = localSaveData[effect];
		}
	}
}

window.temporaryEffectsData = [  //name and type is required for all effects
	{
		name: 'Mage Armor',
		magicArmorMod: '3',
		type: 'spell'  
	},
	{
		name: 'Pass without a Trace',
		skillMod: {
			Stealth: '10'
		},
		type: 'spell'
	},
	{
		name: 'Shield',
		magicArmorMod: '5',
		type: 'spell'
	},
	{
		name: 'Fly',  
		movement: {
			Flying: '60',
		},
		type: 'spell'
	},
	{
		name: 'RAGE',  
		defenses: {
			Resistance: ['Slashing', 'Piercing', 'Bludgeoning'],
		},
		damage: {
			constant: '2',
			levelRestriction: {
				class: 'Barbarian',
				levels: ['1', '9', '16'],
				higherlevelsconstant:['2', '3', '4'],
			},
			restrictions: ['Melee Weapon']
		},
		type: 'class'
	},
	{
		name: 'Sharpshooter -5 +10',
		tohit: {
			constant: '-5',
			restrictions: ['Ranged Weapon']
		},
		damage: {
			constant: '10',
			restrictions: ['Ranged Weapon']
		},
		type: 'feat'
	},
	{
		name: 'Great Weapon Master -5 +10',  
		tohit: {
			constant: '-5',
			restrictions: ['Melee', 'Heavy']
		},
		damage: {
			constant: '10',
			restrictions: ['Melee', 'Heavy']
		},
		type: 'feat'
	},

	{
		name: 'Aura of Protection',
		dropdown: true,
		dropdownOptions:{
			savingThrowMods:{
				0: {
					str: '0',
					dex: '0',
					con: '0',
					int: '0',
					wis: '0',
					cha: '0'
				},
				1: {
					str: '1',
					dex: '1',
					con: '1',
					int: '1',
					wis: '1',
					cha: '1'
				},
				2: {
					str: '2',
					dex: '2',
					con: '2',
					int: '2',
					wis: '2',
					cha: '2'
				},
				3: {
					str: '3',
					dex: '3',
					con: '3',
					int: '3',
					wis: '3',
					cha: '3'
				},
				4: {
					str: '4',
					dex: '4',
					con: '4',
					int: '4',
					wis: '4',
					cha: '4'
				},
				5: {
					str: '5',
					dex: '5',
					con: '5',
					int: '5',
					wis: '5',
					cha: '5'
				},
				6: {
					str: '6',
					dex: '6',
					con: '6',
					int: '6',
					wis: '6',
					cha: '6'
				}
			}
		},
		savingThrowMods: {
					str: '0',
					dex: '0',
					con: '0',
					int: '0',
					wis: '0',
					cha: '0'
		},
		type: 'class'
	}
];

initTemporaryEffects(window.temporaryEffectsData);







function initTemporaryEffects(data){
	for (status in data){
		if(window.temporaryEffects[data[status].name] == undefined)
			window.temporaryEffects[data[status].name] = data[status];
	}
}

function setAttackBonus(feature){
	let attackItems = $(`.ddbc-combat-attack--item`)


	loopAttacks(0, attackItems.length, function(i){
		$(attackItems[i]).click();
		let adjustThisToHit = true;

		if(feature.tohit != undefined){
			for(restriction in feature.tohit.restrictions){
				if($(attackItems[i]).find(`.ddbc-combat-attack__meta-item:contains('${feature.damage.restrictions[restriction]}')`).length == 0 && $(attackItems[i]).find(`.ddbc-note-components__component:contains('${feature.damage.restrictions[restriction]}')`).length == 0)
					adjustThisToHit = false;
			}
		}
		else{
				adjustThisToHit = false;
		}
		let adjustThisToDamage = true;
		let classRestriction = '';
		let levelRestriction = '';
		let adjustToBasedOnLevel = 0;

		
		if(feature.damage != undefined){
			if(feature.damage.levelRestriction != undefined){
				if(feature.damage.levelRestriction.class){
					let levelSubstringPoisition = $(`.ddbc-character-summary__classes`).text().indexOf(feature.damage.levelRestriction.class) + feature.damage.levelRestriction.class.length;
					levelRestriction = parseInt($(`.ddbc-character-summary__classes`).text().substring(levelSubstringPoisition, levelSubstringPoisition+3));
					for(item in feature.damage.levelRestriction.levels){
						if(parseInt(feature.damage.levelRestriction.levels[item]) <= levelRestriction){
							feature.damage.constant = parseInt(feature.damage.levelRestriction.higherlevelsconstant[item]);
						}
					}
				}
			}
			for(restriction in feature.damage.restrictions){
				if($(attackItems[i]).find(`.ddbc-combat-attack__meta-item:contains('${feature.damage.restrictions[restriction]}')`).length == 0 && $(attackItems[i]).find(`.ddbc-note-components__component:contains('${feature.damage.restrictions[restriction]}')`).length == 0)
					adjustThisToDamage = false;
				}
				
		}
		else {
			adjustThisToDamage = false;
		}

		if(!adjustThisToHit && !adjustThisToDamage)
			return;


			if($('.ct-item-detail .ddbc-collapsible--collapsed').length > 0){
				$(`.ct-item-detail .ddbc-collapsible__header`).click();	
			}
			if(adjustThisToHit){
				addValueToCustomValueField(feature, feature.tohit.constant, 12)
			}

			if(adjustThisToDamage){
				 addValueToCustomValueField(feature, feature.damage.constant, 10)
			}
			addValueToCustomValueField(feature, feature.name, 9)
	});
				
}

function removeAttackBonus(feature){
	let attackItems = $(`.ddbc-combat-attack--item`)

	loopAttacks(0, attackItems.length, function(i){
		$(attackItems[i]).click();
		let adjustThisToHit = true;
		if(feature.tohit != undefined){
			for(restriction in feature.tohit.restrictions){
				if($(attackItems[i]).find(`.ddbc-combat-attack__meta-item:contains('${feature.damage.restrictions[restriction]}')`).length == 0 && $(attackItems[i]).find(`.ddbc-note-components__component:contains('${feature.damage.restrictions[restriction]}')`).length == 0)
					adjustThisToHit = false;
			}
		}
		else{
			adjustThisToHit = false;
		}

		let adjustThisToDamage = true;
		if(feature.damage != undefined){
			for(restriction in feature.damage.restrictions){
				if($(attackItems[i]).find(`.ddbc-combat-attack__meta-item:contains('${feature.damage.restrictions[restriction]}')`).length == 0 && $(attackItems[i]).find(`.ddbc-note-components__component:contains('${feature.damage.restrictions[restriction]}')`).length == 0)
					adjustThisToDamage = false;
			}
		}
		else{
			adjustThisToDamage = false;
		}
		if(!adjustThisToHit && !adjustThisToDamage)
			return;
		setTimeout(function(){
			if($('.ct-item-detail .ddbc-collapsible--collapsed').length > 0){
				$(`.ct-item-detail .ddbc-collapsible__header`).click();	
			}
			if(adjustThisToHit){
				removeValueFromCustomField(feature, feature.tohit.constant, 12)
			}

			if(adjustThisToDamage){			
				removeValueFromCustomField(feature, feature.damage.constant, 10);
			}
			removeValueFromCustomField(feature, feature.name, 9);
		}, 200)
			
	});
}

function loopAttacks(i, length, callback=function(){}) {        
  setTimeout(function() {   
  	$(".ct-sidebar__pane").css("visibility", "hidden");
  	callback(i);
    i++;                   
    if (i < $(`.ddbc-combat-attack--item`).length) {           
      loopAttacks(i, length, callback);             
    }
    else{
    	window.loopingAttacks = false;
    	setTimeout(function(){
    		$(".statusEffects").click();
    		$(".ct-sidebar__pane").css("visibility", "visible");
    	}, 1000)	
    }                       
  }, 300)
}

function addValueToCustomValueField(feature, featureValue, editorPropertyNumber){
	let targetValue = $(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-value input[type='number']`)
	if(targetValue.length > 0){
		let reactProps = getReactProps(targetValue);
		let currentValue = parseInt(targetValue[0][reactProps].value);
		
		currentValue = isNaN(currentValue) ?  0 : currentValue;
		
		targetValue[0][reactProps].value = currentValue + parseInt(featureValue);
		targetValue[0][reactProps].onBlur({target: targetValue[0][reactProps]})
	}

	if($(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-source input`).length > 0){
		
		reactProps = getReactProps(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-source input`);
		
		$(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-source input`)[0][reactProps].value += feature.name;
		$(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-source input`)[0][reactProps].onBlur({target: $(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-source input`)[0][reactProps]})
	}
}

function setValueToCustomValueField(feature, featureValue, editorPropertyNumber){
	let reactProps = getReactProps(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-value input`);

	$(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-value input`)[0][reactProps].value = parseInt(featureValue);
	$(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-value input`)[0][reactProps].onBlur({target: $(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-value input`)[0][reactProps]})
	if($(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-source input`).length > 0){
		
		reactProps = getReactProps(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-source input`);
		
		$(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-source input`)[0][reactProps].value = feature.name;
		$(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-source input`)[0][reactProps].onBlur({target: $(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-source input`)[0][reactProps]})
	}
}


function removeValueFromCustomField(feature, featureValue, editorPropertyNumber){
	let targetValue = $(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-value input[type='number']`)
	if(targetValue.length > 0){
		let reactProps = getReactProps(targetValue);
		let currentValue = parseInt(targetValue[0][reactProps].value);
		currentValue = isNaN(currentValue) ?  0 : currentValue;

		targetValue[0][reactProps].value = currentValue - parseInt(featureValue);
		targetValue[0][reactProps].onBlur({target: targetValue[0][reactProps]})
	}

	if($(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-source input`).length > 0){
		reactProps = getReactProps(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-source input`);
		
		$(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-source input`)[0][reactProps].value = $(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-source input`)[0].value.replace(feature.name, "");
		$(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-source input`)[0][reactProps].onBlur({target: $(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-source input`)[0][reactProps]});
	}
}
function setSavingThrowMagicBonus(feature){

	for(savingThrow in feature.savingThrowMods){
		$(`.ddbc-saving-throws-summary__ability--${savingThrow}`).click();
		$(`.ct-ability-saving-throws-pane .ddbc-collapsible__header`).click();			
		addValueToCustomValueField(feature, feature.savingThrowMods[savingThrow], 40)	
	}

}

function setDropdownSavingThrowMagicBonus(feature){

	for(savingThrow in feature.savingThrowMods){
		$(`.ddbc-saving-throws-summary__ability--${savingThrow}`).click();
		$(`.ct-ability-saving-throws-pane .ddbc-collapsible__header`).click();			
		setValueToCustomValueField(feature, feature.savingThrowMods[savingThrow], 40)	
	}

}

function removeSavingThrowMagicBonus(feature){

	for(savingThrow in feature.savingThrowMods){
		$(`.ddbc-saving-throws-summary__ability--${savingThrow}`).click();
		$(`.ct-ability-saving-throws-pane .ddbc-collapsible__header`).click();
		removeValueFromCustomField(feature, feature.savingThrowMods[savingThrow], 40)
	}
}

function setArmorMagicBonus(feature){

	$(".ddbc-armor-class-box").click();
	$(`.ct-armor-manage-pane .ddbc-collapsible__header`).click();	
	addValueToCustomValueField(feature, feature.magicArmorMod, 2)

}

function removeArmorMagicBonus(feature){

	$(".ddbc-armor-class-box").click();
	$(`.ct-armor-manage-pane .ddbc-collapsible__header`).click();	
	removeValueFromCustomField(feature, feature.magicArmorMod, 2)
}

function setSkillBonus(feature){

	for(skill in feature.skillMod){
		$(`.ct-skills__col--skill:contains(${skill})`).click();
		$(`.ct-skill-pane .ddbc-collapsible__header`).click();			
		addValueToCustomValueField(feature, feature.skillMod[skill], 24)	
	}
}

function removeSkillBonus(feature){

	for(skill in feature.skillMod){
		$(`.ct-skills__col--skill:contains(${skill})`).click();
		$(`.ct-skill-pane .ddbc-collapsible__header`).click();	
		removeValueFromCustomField(feature, feature.skillMod[skill], 24)
	}
}

function setDefenses(feature){

	for(type in feature.defenses){
		$(`.ct-combat__statuses-group--defenses`).click();	
		$(`.ct-defense-manage-pane .ddbc-collapsible__header`).click();	
		targetDefense = $('.dct-defense-manage-pane__custom-field  .ddbc-select');
		reactProps = getReactProps(targetDefense);
       
		targetDefense[0][reactProps].value =  $(`.dct-defense-manage-pane__custom-field select option:contains('${type}')`).val();
		targetDefense[0][reactProps].onChange({target: targetDefense[0][reactProps]});

		for(defense in feature.defenses[type]){
			targetDefense = $(`.ddbc-collapsible__content .ddbc-select`);

			reactProps = getReactProps(targetDefense);
	       
			targetDefense[1][reactProps].value =  $(`select option:contains('${feature.defenses[type][defense]}')`).val();
			targetDefense[1][reactProps].onChange({target: targetDefense[1][reactProps]});
		}

	}
}

function removeDefenses(feature){
		for(type in feature.defenses){
			$(`.ct-combat__statuses-group--defenses`).click();	
			$(`.ct-defense-manage-pane .ddbc-collapsible__header`).click();
			for(defense in feature.defenses[type]){
				$(`.ct-defense-manage-pane__custom-item-label:contains('${feature.defenses[type][defense]}')`).parent().find(`.ct-button__content:contains('Delete')`).click();
			}
		}
}

function setMovementBonus(feature){


	$(`.ct-speed-box`).click();
	$(`.ct-speed-manage-pane .ddbc-collapsible__header`).click();		
	for(moveType in feature.movement){
		let targetMovement = $(`.ct-speed-manage-pane__customize-item-label:contains("${moveType}")`).parent().find('.ct-speed-manage-pane__customize-item-input input');
		let featureValue = feature.movement[moveType];
		let reactProps = getReactProps(targetMovement);
		let currentValue = parseInt(targetMovement[0][reactProps].value);
		currentValue = isNaN(currentValue) ?  0 : currentValue;

		targetMovement[0][reactProps].value = parseInt(featureValue);
		targetMovement[0][reactProps].onBlur({target: targetMovement[0][reactProps]});		//need figure out whats going on here and why this only half works
		targetMovement[0][reactProps].onChange({target: targetMovement[0][reactProps]});


		targetMovement = $(`.ct-speed-manage-pane__customize-item-label:contains("${moveType}")`).parent().find('.ct-speed-manage-pane__customize-item-source input');
			
		reactProps = getReactProps(targetMovement);

		targetMovement[0][reactProps].onBlur({target: targetMovement[0][reactProps]});
		targetMovement[0][reactProps].onChange({target: targetMovement[0][reactProps]});
	}
	if(feature.name == "Fly Spell"){
		targetMovement = $('.ct-speed-manage-pane .ddbc-select');
		reactProps = getReactProps(targetMovement);

		targetMovement[0][reactProps].value = 4;
		targetMovement[0][reactProps].onChange({target: targetMovement[0][reactProps]});	
	}
}

function removeMovementBonus(feature){
	$(`.ct-speed-box`).click();
	$(`.ct-speed-manage-pane .ddbc-collapsible__header`).click();		
	for(moveType in feature.movement){
		let targetMovement = $(`.ct-speed-manage-pane__customize-item-label:contains("${moveType}")`).parent().find('.ct-speed-manage-pane__customize-item-input input');
		let featureValue = feature.movement[moveType];
		let reactProps = getReactProps(targetMovement);
		let currentValue = parseInt(targetMovement[0][reactProps].value);
		currentValue = isNaN(currentValue) ?  0 : currentValue;

		targetMovement[0][reactProps].value = '';
		targetMovement[0][reactProps].onBlur({target: targetMovement[0][reactProps]});
		targetMovement[0][reactProps].onChange({target: targetMovement[0][reactProps]});

		targetMovement = $(`.ct-speed-manage-pane__customize-item-label:contains("${moveType}")`).parent().find('.ct-speed-manage-pane__customize-item-source input');
			
		reactProps = getReactProps(targetMovement);

		targetMovement[0][reactProps].onBlur({target: targetMovement[0][reactProps]});
		targetMovement[0][reactProps].onChange({target: targetMovement[0][reactProps]});

	}
	if(feature.name == "Fly Spell"){
		targetMovement = $('.ct-speed-manage-pane .ddbc-select');
		reactProps = getReactProps(targetMovement);

		targetMovement[0][reactProps].value = 1;
		targetMovement[0][reactProps].onChange({target: targetMovement[0][reactProps]});	
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
	let sidebarPanel = $(`<div id='statusEffectsPanel'>
		<div>
			Spells
			<div class='spell'></div>
		</div>
		<div>
			Class Abilities
			<div class='class'></div>
		</div>
		<div>
			Feats
			<div class='feat'></div>
		</div>`);
	let button;
	for(i in window.temporaryEffects){
		let cleanedFeatureName = i.replace(/[^A-Z0-9]/ig, "");
		let activeTrueFalse = (window.temporaryEffects[i].applied) ? true : false;
		let active = (activeTrueFalse) ? 'ddbc-toggle-field--is-enabled' : 'ddbc-toggle-field--is-disabled';
		if(window.temporaryEffects[i].dropdown == true){
			button = $(`
			<div class="ct-condition-manage-pane__condition-heading" data-name='${i}'>
				<div class="ct-condition-manage-pane__condition">
					<div class="ct-condition-manage-pane__condition-preview"></div>
					<div class="ct-condition-manage-pane__condition-name">
						${i}
					</div>
					<div class="ct-condition-manage-pane__condition-toggle">
						<select data-name='${i}'>
						    
						</select>
						</div>
					</div>
				</div>
			</div>
			`);
			for(mod in window.temporaryEffects[i].dropdownOptions){
				for(option in window.temporaryEffects[i].dropdownOptions[mod]){
					let selected = 'selected';
					for(list in window.temporaryEffects[i].dropdownOptions[mod][option]){
						if(window.temporaryEffects[i][mod][list] != window.temporaryEffects[i].dropdownOptions[mod][option][list])
							selected = '';
					}
					
					$(button).find(`select`).append(`<option value='${option}' ${selected}>${option}</option>`)
				}
			}

		}
		else{
			button = $(`
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
		}
	

		if($(`.ct-condition-manage-pane__condition-heading[data-name='${i}']`).length == 0)	
			sidebarPanel.find(`.${window.temporaryEffects[i].type}`).append(button);
		
		if($('#statusEffectsPanel').length == 0)
			$(".ct-sidebar__pane-content").prepend(sidebarPanel);	
		

		
		$(button).find(`select[data-name='${i}']`).change(function(){
			  let optionSelected = $("option:selected", this);
    		let valueSelected = this.value;
    		for(mod in window.temporaryEffects[i].dropdownOptions){
    			for(value in window.temporaryEffects[i][mod]){
    				window.temporaryEffects[i][mod][value] = valueSelected;
    			}
    		}
    		$(button).trigger('click');
		});
		$(button).off().on('click', function(e){
			if(e.target.tagName == 'SELECT'){
				e.stopImmediatePropagation();
				return;
			}
			let feature = $(this).attr("data-name");
			$(`.ct-initiative-box`).click();
			//MAGIC ARMOR BUTTONS
			$(`.ct-condition-manage-pane__condition-heading[data-name='${feature}'] .ddbc-toggle-field`).toggleClass('ddbc-toggle-field--is-enabled');
			$(`.ct-condition-manage-pane__condition-heading[data-name='${feature}'] .ddbc-toggle-field`).toggleClass('ddbc-toggle-field--is-disabled');
			if(window.temporaryEffects[feature].applied && window.temporaryEffects[feature]['magicArmorMod'] != undefined){
				removeArmorMagicBonus(window.temporaryEffects[feature]);
			}
			else if(window.temporaryEffects[feature]['magicArmorMod'] != undefined){
				setArmorMagicBonus(window.temporaryEffects[feature]);
			}

			if(window.temporaryEffects[feature].applied && window.temporaryEffects[feature]['skillMod'] != undefined){
				removeSkillBonus(window.temporaryEffects[feature]);
			}
			else if(window.temporaryEffects[feature]['skillMod'] != undefined){
				setSkillBonus(window.temporaryEffects[feature]);
			}

			if(window.temporaryEffects[feature].applied && window.temporaryEffects[feature]['savingThrowMods'] != undefined && !window.temporaryEffects[feature].dropdown){
				removeSavingThrowMagicBonus(window.temporaryEffects[feature]);
			}
			else if(window.temporaryEffects[feature]['savingThrowMods'] != undefined && window.temporaryEffects[feature].dropdown){
				setDropdownSavingThrowMagicBonus(window.temporaryEffects[feature]);
			}
			else if(window.temporaryEffects[feature]['savingThrowMods'] != undefined){
				setSavingThrowMagicBonus(window.temporaryEffects[feature]);
			}

			if(window.temporaryEffects[feature].applied && window.temporaryEffects[feature]['movement'] != undefined){
				removeMovementBonus(window.temporaryEffects[feature]);
			}
			else if(window.temporaryEffects[feature]['movement'] != undefined){
				setMovementBonus(window.temporaryEffects[feature]);
			}

			if(window.temporaryEffects[feature].applied && window.temporaryEffects[feature]['defenses'] != undefined){
				removeDefenses(window.temporaryEffects[feature]);
			}
			else if(window.temporaryEffects[feature]['defenses'] != undefined){
				setDefenses(window.temporaryEffects[feature]);
			}


			if(window.temporaryEffects[feature].applied && (window.temporaryEffects[feature]['tohit'] != undefined || window.temporaryEffects[feature]['damage'] != undefined)){
				removeAttackBonus(window.temporaryEffects[feature]);
				window.loopingAttacks = true;
			}
			else if(window.temporaryEffects[feature]['tohit'] != undefined || window.temporaryEffects[feature]['damage'] != undefined){
				setAttackBonus(window.temporaryEffects[feature]);		
					window.loopingAttacks = true;	
			}

			if(window.temporaryEffects[feature].applied == true){
				delete window.temporaryEffects[feature].applied
			}
			else{
				window.temporaryEffects[feature].applied = true;
			}

			if(	window.loopingAttacks == false){
				$('.statusEffects').click()
			}
	
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







