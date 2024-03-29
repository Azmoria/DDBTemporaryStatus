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
		name: 'Bless',
		tohit: {
			constant: '1d4'
		},
		findRestrictions:['.ddbc-combat-attack__tohit'],
		type: 'class',
		savingThrowMods: {
					str: '1d4',
					dex: '1d4',
					con: '1d4',
					int: '1d4',
					wis: '1d4',
					cha: '1d4'
		},
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

set_window_name_and_image(function(){
	initTemporaryEffects(window.temporaryEffectsData)
	window.statusDiceRoller = new statusDiceRoller(); 
});








function initTemporaryEffects(data){
	for (status in data){
		if(window.temporaryEffects[data[status].name] == undefined)
			window.temporaryEffects[data[status].name] = data[status];
	}
}

function setAttackBonus(feature){
	let attackItems = $(`.ddbc-combat-attack`)


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
		let adjustNoteRoll = true;
		if(feature.noteRoll != undefined){
			for(item in feature.findRestrictions){
					if($(attackItems[i]).find(feature.findRestrictions[0]).length == 0)
						adjustNoteRoll = false;
			}
		}
		else{
			adjustNoteRoll = false;
		}

		if(!adjustThisToHit && !adjustThisToDamage && !adjustNoteRoll)
			return;


			if($('.ddbc-collapsible--collapsed').length > 0){
				$(`.ddbc-collapsible__header`).click();	
			}
			if(adjustThisToHit && $(attackItems[i]).find('.ddbc-combat-attack__tohit').length>0){
				
				let button = $(attackItems[i]).find('.ddbc-combat-attack__tohit .integrated-dice__container');
				
					
				let modifier = $(button).find('.ddbc-signed-number').attr('aria-label');

						
				$(button).toggleClass('statusEffectsModified', true);

				$(button).attr('extraMod', feature.tohit.constant);


				let adjustedModifier;

				if((/[0-9]+d[0-9]+/g).test(feature.tohit.constant)){
					adjustedModifier = `${parseInt(modifier.replace(/\s/g, ''))}+${$(button).attr('extraMod')}`;
					$(button).find('.ddbc-signed-number .ddbc-signed-number__number').text(`${Math.abs(parseInt(modifier.replace(/\s/g, '')))}${(parseInt(feature.tohit.constant) == 0) ? '' : '*'}`);
				}
				else{
					adjustedModifier = parseInt(modifier.replace(/\s/g, '')) + parseInt($(button).attr('extraMod'));
					$(button).find('.ddbc-signed-number .ddbc-signed-number__sign').text(`${(adjustedModifier) >= 0 ? '+' : '-'}`);
					$(button).find('.ddbc-signed-number .ddbc-signed-number__number').text(`${Math.abs(adjustedModifier)}${(parseInt(feature.tohit.constant) == 0) ? '' : '*'}`);
				}
				
				$(button).off('click.statusEffects').on('click.statusEffects', function(e){	
						e.stopImmediatePropagation();
					
						modifier = $(this).find('.ddbc-signed-number').attr('aria-label');

								
						$(this).toggleClass('statusEffectsModified', true);

						$(this).attr('extraMod', feature.tohit.constant);

						let adjustedModifier;

						if((/[0-9]+d[0-9]+/g).test(feature.tohit.constant)){
							adjustedModifier = `${parseInt(modifier.replace(/\s/g, ''))}+${$(this).attr('extraMod')}`;
							$(this).find('.ddbc-signed-number .ddbc-signed-number__number').text(`${Math.abs(parseInt(modifier.replace(/\s/g, ''))) ? '' : '*'}`);
							$(this).find('.ddbc-signed-number .ddbc-signed-number__number').text(`${Math.abs(parseInt(modifier.replace(/\s/g, '')))}${(parseInt(feature.tohit.constant) == 0) ? '' : '*'}`);
						}
						else{
							adjustedModifier = parseInt(modifier.replace(/\s/g, '')) + parseInt($(this).attr('extraMod'));
							$(this).find('.ddbc-signed-number .ddbc-signed-number__sign').text(`${(adjustedModifier) >= 0 ? '+' : '-'}`);
							$(this).find('.ddbc-signed-number .ddbc-signed-number__number').text(`${Math.abs(adjustedModifier)}${(parseInt(feature.tohit.constant) == 0) ? '' : '*'}`);
						}


						let diceRoll = getRollData(this)
						window.statusDiceRoller.roll(diceRoll);
				})
					
			//	addValueToCustomValueField(feature, feature.tohit.constant, 12)
			}

			if(adjustThisToDamage && $(attackItems[i]).find('.ddbc-combat-item-attack__damage').length>0){
				let button = $(attackItems[i]).find('.ddbc-combat-item-attack__damage .integrated-dice__container');
				
					
				let modifier = $(button).find('.ddbc-damage__value').text();

						
				$(button).toggleClass('statusEffectsModified', true);

				$(button).attr('extraMod', feature.damage.constant);


				let adjustedModifier;

				if((/[0-9]+d[0-9]+/g).test(feature.damage.constant)){
					adjustedModifier = `${parseInt(modifier.replace(/\s/g, ''))}+${$(button).attr('extraMod')}`;
				}
				else{
					adjustedModifier = parseInt(modifier.replace(/\s/g, '')) + parseInt($(button).attr('extraMod'));
				}
				
				$(button).off('click.statusEffects').on('click.statusEffects', function(e){	
						e.stopImmediatePropagation();
					
						modifier = $(this).find('.ddbc-damage__value').text();

								
						$(this).toggleClass('statusEffectsModified', true);

						$(this).attr('extraMod', feature.damage.constant);

						let adjustedModifier;

						if((/[0-9]+d[0-9]+/g).test(feature.damage.constant)){
							adjustedModifier = `${parseInt(modifier.replace(/\s/g, ''))}+${$(this).attr('extraMod')}`;
						}
						else{
							adjustedModifier = parseInt(modifier.replace(/\s/g, '')) + parseInt($(this).attr('extraMod'));
						}


						let diceRoll = getRollData(this)
						window.statusDiceRoller.roll(diceRoll);
				})
				 //addValueToCustomValueField(feature, feature.damage.constant, 10)
			}
			
			if(adjustNoteRoll){
				addValueToCustomValueField(feature, feature.noteRoll.replace('[mod]', $(attackItems[i]).find('.ddbc-signed-number').attr('aria-label'))+' '+$(attackItems[i]).find('.ddbc-item-name').text(), 9);
			}
			
	});

				
}

function removeAttackBonus(feature){
	let attackItems = $(`.ddbc-combat-attack`)

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
		let adjustNoteRoll = true;
		if(feature.noteRoll != undefined){
			for(item in feature.findRestrictions){
					if($(attackItems[i]).find(feature.findRestrictions[0]).length == 0)
						adjustNoteRoll = false;
			}
		}
		else{
			adjustNoteRoll = false;
		}

		if(!adjustThisToHit && !adjustThisToDamage && !adjustNoteRoll)
			return;

		setTimeout(function(){
			if($('.ddbc-collapsible--collapsed').length > 0){
				$(`.ddbc-collapsible__header`).click();	
			}
			if(adjustThisToHit){
			//	removeValueFromCustomField(feature, feature.tohit.constant, 12)
			}

			if(adjustThisToDamage){			
			//	removeValueFromCustomField(feature, feature.damage.constant, 10);
			}
			if(adjustNoteRoll){
			//	removeValueFromCustomField(feature, feature.noteRoll, 9);
			}
			
		}, 200)
			
	});
}

function loopAttacks(i, length, callback=function(){})  {        
  	callback(i);
    i++;                   
    if (i < $(`.ddbc-combat-attack`).length) {           
      loopAttacks(i, length, callback);             
    }
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
	targetValue = $(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-value input[type='text']`)
	if(targetValue.length > 0){
		let reactProps = getReactProps(targetValue);
		let currentValue = targetValue[0][reactProps].value;
		
		targetValue[0][reactProps].value = featureValue;
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
	targetValue = $(`.ct-value-editor__property--${editorPropertyNumber} .ct-value-editor__property-value input[type='text']`)
	if(targetValue.length > 0){
		let reactProps = getReactProps(targetValue);
		
		
		targetValue[0][reactProps].value = '';
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
		let button = $(`.ddbc-saving-throws-summary__ability--${savingThrow} .integrated-dice__container`)
		
			
		let modifier = $(button).find('.ddbc-signed-number').attr('aria-label');

				
		$(button).toggleClass('statusEffectsModified', true);

		$(button).attr('extraMod', feature.savingThrowMods[savingThrow]);

		let adjustedModifier;

		if((/[0-9]+d[0-9]+/g).test(feature.savingThrowMods[savingThrow])){
			adjustedModifier = `${parseInt(modifier.replace(/\s/g, ''))}+${$(button).attr('extraMod')}`;
			$(button).find('.ddbc-signed-number .ddbc-signed-number__number').text(`${Math.abs(parseInt(modifier.replace(/\s/g, '')))}${(parseInt(feature.savingThrowMods[savingThrow]) == 0) ? '' : '*'}`);
		}
		else{
			adjustedModifier = parseInt(modifier.replace(/\s/g, '')) + parseInt($(button).attr('extraMod'));
			$(button).find('.ddbc-signed-number .ddbc-signed-number__sign').text(`${(adjustedModifier) >= 0 ? '+' : '-'}`);
			$(button).find('.ddbc-signed-number .ddbc-signed-number__number').text(`${Math.abs(adjustedModifier)}${(parseInt(feature.savingThrowMods[savingThrow]) == 0) ? '' : '*'}`);
		}
		


	
	
		$(button).off('click.statusEffects').on('click.statusEffects', function(e){	
				e.stopImmediatePropagation();
			
				let button = this;
		
					
				let modifier = $(button).find('.ddbc-signed-number').attr('aria-label');

						
				$(button).toggleClass('statusEffectsModified', true);

				$(button).attr('extraMod', feature.savingThrowMods[savingThrow]);

				let adjustedModifier;

				if((/[0-9]+d[0-9]+/g).test(feature.savingThrowMods[savingThrow])){
					adjustedModifier = `${parseInt(modifier.replace(/\s/g, ''))}+${$(button).attr('extraMod')}`;
					$(button).find('.ddbc-signed-number .ddbc-signed-number__number').text(`${Math.abs(parseInt(modifier.replace(/\s/g, '')))}${(parseInt(feature.savingThrowMods[savingThrow]) == 0) ? '' : '*'}`);
				}
				else{
					adjustedModifier = parseInt(modifier.replace(/\s/g, '')) + parseInt($(button).attr('extraMod'));
					$(button).find('.ddbc-signed-number .ddbc-signed-number__sign').text(`${(adjustedModifier) >= 0 ? '+' : '-'}`);
					$(button).find('.ddbc-signed-number .ddbc-signed-number__number').text(`${Math.abs(adjustedModifier)}${(parseInt(feature.savingThrowMods[savingThrow]) == 0) ? '' : '*'}`);
				}


			
				let diceRoll = getRollData(button)
				window.statusDiceRoller.roll(diceRoll);
		})
	}

}

function setDropdownSavingThrowMagicBonus(feature){

	for(savingThrow in feature.savingThrowMods){
		
		let button = $(`.ddbc-saving-throws-summary__ability--${savingThrow} .integrated-dice__container`)

			
		let modifier = $(button).find('.ddbc-signed-number').attr('aria-label');

				
		$(button).toggleClass('statusEffectsModified', true);

		$(button).attr('extraMod', feature.savingThrowMods[savingThrow]);

		let adjustedModifier;

		if(feature.savingThrowMods[savingThrow].match(/[0-9]+d[0-9]+/g)){
			adjustedModifier = `${parseInt(modifier.replace(/\s/g, ''))}+${$(button).attr('extraMod')}`;
			$(button).find('.ddbc-signed-number .ddbc-signed-number__number').text(`${Math.abs(parseInt(modifier.replace(/\s/g, '')))}${(parseInt(feature.savingThrowMods[savingThrow]) == 0) ? '' : '*'}`);
		}
		else{
			adjustedModifier = parseInt(modifier.replace(/\s/g, '')) + parseInt($(button).attr('extraMod'));
			$(button).find('.ddbc-signed-number .ddbc-signed-number__sign').text(`${(adjustedModifier) >= 0 ? '+' : '-'}`);
			$(button).find('.ddbc-signed-number .ddbc-signed-number__number').text(`${Math.abs(adjustedModifier)}${(parseInt(feature.savingThrowMods[savingThrow]) == 0) ? '' : '*'}`);
		}
		$(button).off('click.statusEffects').on('click.statusEffects', function(e){	
				e.stopImmediatePropagation();
			
			let button = this;
	
				
			let modifier = $(button).find('.ddbc-signed-number').attr('aria-label');

					
			$(button).toggleClass('statusEffectsModified', true);

			$(button).attr('extraMod', feature.savingThrowMods[savingThrow]);

			let adjustedModifier;

			if(feature.savingThrowMods[savingThrow].match(/[0-9]+d[0-9]+/g)){
				adjustedModifier = `${parseInt(modifier.replace(/\s/g, ''))}+${$(button).attr('extraMod')}`;
				$(button).find('.ddbc-signed-number .ddbc-signed-number__number').text(`${Math.abs(parseInt(modifier.replace(/\s/g, '')))}${(parseInt(feature.savingThrowMods[savingThrow]) == 0) ? '' : '*'}`);
			}
			else{
				let adjustedModifier = parseInt(modifier.replace(/\s/g, '')) + parseInt($(button).attr('extraMod'));
				$(button).find('.ddbc-signed-number .ddbc-signed-number__sign').text(`${(adjustedModifier) >= 0 ? '+' : '-'}`);
				$(button).find('.ddbc-signed-number .ddbc-signed-number__number').text(`${Math.abs(adjustedModifier)}${(parseInt(feature.savingThrowMods[savingThrow]) == 0) ? '' : '*'}`);
			}


			
				let diceRoll = getRollData(button)
				window.statusDiceRoller.roll(diceRoll);
		})
	}

}
function gamelog_send_to_text() {
    // TODO: track characters page in window.sendTo so we know what they have set even if the gamelog is not on the screen
    let expectedButtonText = $(".glc-game-log .tss-l9t796-SendToLabel").parent().find("button").text();
    if (expectedButtonText !== undefined && expectedButtonText.length > 0) {
        return expectedButtonText.replace(/\s+/g, '');
    }
   
    return "Everyone"
  
}
function getRollData(rollButton){
    let expression = '';
    if($(rollButton).find('.ddbc-damage__value').length>0){
      expression = `${$(rollButton).find('.ddbc-damage__value').text().replace(/\s/g, '')}+${((/[0-9]+d[0-9]+/g).test($(rollButton).attr('extraMod'))) ? $(rollButton).attr('extraMod') : parseInt($(rollButton).attr('extraMod'))}`;
    }
    else if($(rollButton).find('.ddbc-signed-number').length>0){
      expression = `1d20${$(rollButton).find('.ddbc-signed-number').attr('aria-label').replace(/\s/g, '')}+${((/[0-9]+d[0-9]+/g).test($(rollButton).attr('extraMod'))) ? $(rollButton).attr('extraMod') : parseInt($(rollButton).attr('extraMod'))}`;
    }
    else if($(rollButton).find('.ddbc-healing-icon').length > 0){
      expression = $(rollButton).text().replace(/\s/g, '');
    }
    if($(rollButton).hasClass('avtt-roll-formula-button')){
      expression = statusDiceRoll.fromSlashCommand($(rollButton).attr('data-slash-command')).expression;
    }
    let roll = new rpgDiceRoller.DiceRoll(expression); 
    let regExpression = new RegExp(`${expression.replace(/[+-]/g, '\\$&')}:\\s`);
    let rollType = 'custom';
    let rollTitle = 'Status Effects';
    if($(rollButton).parents(`[class*='saving-throws-summary']`).length > 0){
      rollType = 'save'
      rollTitle = $(rollButton).closest(`.ddbc-saving-throws-summary__ability`).find('.ddbc-saving-throws-summary__ability-name abbr').text();
    } else if($(rollButton).parents(`[class*='ability-summary']`).length > 0){
      rollType = 'check'
      rollTitle = $(rollButton).closest(`.ddbc-ability-summary`).find('.ddbc-ability-summary__abbr').text();
    } else if($(rollButton).parents(`[class*='skills__col']`).length > 0){
      rollType = 'check';
      rollTitle = $(rollButton).closest(`.ct-skills__item`).find('.ct-skills__col--skill').text();
    } else if($(rollButton).parents(`[class*='initiative-box']`).length > 0){
      rollTitle = 'Initiative'
    } else if($(rollButton).parents(`[class*='__damage']`).length > 0){
      rollType = 'damage'
      if($(rollButton).parents(`[class*='damage-effect__healing']`).length > 0){
        rollType = 'heal'
      }
    } else if($(rollButton).parents(`[class*='__tohit']`).length > 0){
      rollType = 'attack'
    } 
    if(rollType == 'damage' || rollType == 'attack' || rollType == 'heal'){
      if($(rollButton).parents(`.ddbc-combat-attack--spell`).length > 0){
        rollTitle = $(rollButton).closest(`.ddbc-combat-attack--spell`).find('.ddbc-spell-name').text();
      }
      else if($(rollButton).parents(`.ct-spells-spell`).length > 0){
        rollTitle = $(rollButton).closest(`.ct-spells-spell`).find('.ddbc-spell-name').text();
      }
      else if($(rollButton).parents(`.ddbc-combat-action-attack-weapon`).length > 0){
        rollTitle = $(rollButton).closest(`.ddbc-combat-action-attack-weapon`).find('.ddbc-action-name').text();
      }
      else if($(rollButton).parents(`.ddbc-combat-attack--item`).length > 0){
        rollTitle = $(rollButton).closest(`.ddbc-combat-attack--item`).find('.ddbc-item-name').text();
      }
    }
    const modifier = (roll.rolls.length > 1 && expression.match(/[+-]\d*$/g, '')) ? `${roll.rolls[roll.rolls.length-2]}${roll.rolls[roll.rolls.length-1]}` : '';

    return {
      roll: roll,
      expression: expression,
      rollType: rollType,
      action: rollTitle,
      modifier: modifier,
      regExpression: regExpression
    }
}
function removeSavingThrowMagicBonus(feature){

	/*for(savingThrow in feature.savingThrowMods){
		$(`.ddbc-saving-throws-summary__ability--${savingThrow}`).click();
		$(`.ct-ability-saving-throws-pane .ddbc-collapsible__header`).click();
		removeValueFromCustomField(feature, feature.savingThrowMods[savingThrow], 40)
	}*/
}

function setArmorMagicBonus(feature){

	/*$(".ddbc-armor-class-box").click();
	$(`.ct-armor-manage-pane .ddbc-collapsible__header`).click();	
	addValueToCustomValueField(feature, feature.magicArmorMod, 2)
*/
}

function removeArmorMagicBonus(feature){

	/*$(".ddbc-armor-class-box").click();
	$(`.ct-armor-manage-pane .ddbc-collapsible__header`).click();	
	removeValueFromCustomField(feature, feature.magicArmorMod, 2)*/
}

function setSkillBonus(feature){


	for(skill in feature.skillMod){
		let button = $(`.ct-skills__col--skill:contains(${skill})`).parent().find('.integrated-dice__container');
		
			
		let modifier = $(button).find('.ddbc-signed-number').attr('aria-label');

				
		$(button).toggleClass('statusEffectsModified', true);

		$(button).attr('extraMod', feature.skillMod[skill]);


		let adjustedModifier;

		if((/[0-9]+d[0-9]+/g).test(feature.skillMod[skill])){
			adjustedModifier = `${parseInt(modifier.replace(/\s/g, ''))}+${$(button).attr('extraMod')}`;
					$(button).find('.ddbc-signed-number .ddbc-signed-number__number').text(`${Math.abs(parseInt(modifier.replace(/\s/g, '')))}${(parseInt(feature.skillMod[skill]) == 0) ? '' : '*'}`);
		}
		else{
			adjustedModifier = parseInt(modifier.replace(/\s/g, '')) + parseInt($(button).attr('extraMod'));
			$(button).find('.ddbc-signed-number .ddbc-signed-number__sign').text(`${(adjustedModifier) >= 0 ? '+' : '-'}`);
			$(button).find('.ddbc-signed-number .ddbc-signed-number__number').text(`${Math.abs(adjustedModifier)}${(parseInt(feature.skillMod[skill]) == 0) ? '' : '*'}`);
		}
		
		$(button).off('click.statusEffects').on('click.statusEffects', function(e){	
				e.stopImmediatePropagation();
			
				modifier = $(button).find('.ddbc-signed-number').attr('aria-label');

						
				$(button).toggleClass('statusEffectsModified', true);

				$(button).attr('extraMod', parseInt(feature.skillMod[skill]));

				let adjustedModifier;

				if((/[0-9]+d[0-9]+/g).test(feature.skillMod[skill])){
					adjustedModifier = `${parseInt(modifier.replace(/\s/g, ''))}+${$(button).attr('extraMod')}`;
					$(button).find('.ddbc-signed-number .ddbc-signed-number__number').text(`${Math.abs(parseInt(modifier.replace(/\s/g, ''))) ? '' : '*'}`);
					$(button).find('.ddbc-signed-number .ddbc-signed-number__number').text(`${Math.abs(parseInt(modifier.replace(/\s/g, '')))}${(parseInt(feature.skillMod[skill]) == 0) ? '' : '*'}`);
				}
				else{
					let adjustedModifier = parseInt(modifier.replace(/\s/g, '')) + parseInt($(button).attr('extraMod'));
					$(button).find('.ddbc-signed-number .ddbc-signed-number__sign').text(`${(adjustedModifier) >= 0 ? '+' : '-'}`);
					$(button).find('.ddbc-signed-number .ddbc-signed-number__number').text(`${Math.abs(adjustedModifier)}${(parseInt(feature.skillMod[skill]) == 0) ? '' : '*'}`);
				}


				let diceRoll = getRollData(button)
				window.statusDiceRoller.roll(diceRoll);
		})
	}
}

function removeSkillBonus(feature){

	/*for(skill in feature.skillMod){
		$(`.ct-skills__col--skill:contains(${skill})`).click();
		$(`.ct-skill-pane .ddbc-collapsible__header`).click();	
		removeValueFromCustomField(feature, feature.skillMod[skill], 24)
	}*/
}

function setDefenses(feature){

/*	for(type in feature.defenses){
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

	}*/
}

function removeDefenses(feature){
	/*	for(type in feature.defenses){
			$(`.ct-combat__statuses-group--defenses`).click();	
			$(`.ct-defense-manage-pane .ddbc-collapsible__header`).click();
			for(defense in feature.defenses[type]){
				$(`.ct-defense-manage-pane__custom-item-label:contains('${feature.defenses[type][defense]}')`).parent().find(`.ct-button__content:contains('Delete')`).click();
			}
		}*/
}

function setMovementBonus(feature){


/*	$(`.ct-speed-box`).click();
	$(`.ct-speed-manage-pane .ddbc-collapsible__header`).click();		
	for(moveType in feature.movement){
		let targetMovement = $(`.ct-speed-manage-pane__customize-item-label:contains("${moveType}")`).parent().find('.ct-speed-manage-pane__customize-item-input input');
		let featureValue = feature.movement[moveType];
		let reactProps = getReactProps(targetMovement);
		let currentValue = parseInt(targetMovement[0][reactProps].value);
		currentValue = isNaN(currentValue) ?  0 : currentValue;

		targetMovement[0][reactProps].value = parseInt(featureValue);
		targetMovement[0][reactProps].onBlur({target: targetMovement[0][reactProps]});		
		targetMovement[0][reactProps].onChange({target: targetMovement[0][reactProps]});


		targetMovement = $(`.ct-speed-manage-pane__customize-item-label:contains("${moveType}")`).parent().find('.ct-speed-manage-pane__customize-item-source input');
			
		reactProps = getReactProps(targetMovement);  //need figure out whats going on here and why this only half works - name doesn't get set in source
		targetMovement[0][reactProps].value = feature.name;
		targetMovement[0][reactProps].onBlur({target: targetMovement[0][reactProps]});
		targetMovement[0][reactProps].onChange({target: targetMovement[0][reactProps]});
	}
	if(feature.name == "Fly"){
		targetMovement = $('.ct-speed-manage-pane .ddbc-select');
		reactProps = getReactProps(targetMovement);

		targetMovement[0][reactProps].value = 4;
		targetMovement[0][reactProps].onChange({target: targetMovement[0][reactProps]});	
	}*/
}

function removeMovementBonus(feature){
	/*$(`.ct-speed-box`).click();
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
		targetMovement[0][reactProps].value = '';
		targetMovement[0][reactProps].onBlur({target: targetMovement[0][reactProps]});
		targetMovement[0][reactProps].onChange({target: targetMovement[0][reactProps]});

	}
	if(feature.name == "Fly"){
		targetMovement = $('.ct-speed-manage-pane .ddbc-select');
		reactProps = getReactProps(targetMovement);

		targetMovement[0][reactProps].value = 1;
		targetMovement[0][reactProps].onChange({target: targetMovement[0][reactProps]});	
	}*/

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
	$('#statussite').css('--theme-color', $('.ddbc-svg--themed path').css('fill'));
	let statusButton = `<div class="ct-character-header-desktop__button statusEffects" role="button" tabindex="0"><div class="ct-character-header-desktop__button-icon"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
<metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
<g><g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)"><path d="M3648.4,4262.7c-643.5-116.4-1078.6-496.4-1254.3-1095c-36.8-126.7-44.9-220.6-53.1-586.3c-10.2-396.3-14.3-435.1-49-455.6c-145-77.6-171.6-531.1-51.1-876.4c61.3-179.8,183.8-388.1,306.4-525c67.4-73.5,110.3-151.2,155.3-277.8c185.9-514.8,584.2-900.9,1054.1-1025.5c647.6-171.6,1360.5,286,1630.2,1050c32.7,91.9,83.8,183.9,126.7,232.9c120.5,130.8,253.3,355.5,318.7,531.1c53.1,141,65.4,206.3,73.5,402.4c10.2,267.6-14.3,386.1-91.9,465.8c-51.1,51.1-53.1,59.2-57.2,349.3c-6.2,449.4-81.7,737.5-243.1,915.2c-40.9,44.9-73.5,96-73.5,112.4c0,16.3-20.4,85.8-42.9,157.3c-104.2,308.5-459.6,531.1-996.9,625.1C4193.8,4299.5,3848.6,4299.5,3648.4,4262.7z"/><path d="M7276.5,381.4c-939.7-177.7-1632.2-856-1826.3-1787.5c-47-224.7-49-643.5-2.1-858c192-888.6,802.8-1528,1679.2-1758.9c159.4-42.9,226.8-49,539.3-47c320.7,0,377.9,6.1,561.8,55.2c829.4,222.7,1446.3,876.4,1636.3,1736.4c47,210.4,47,670,0,882.5C9666.6-503.2,9010.8,164.8,8142.6,363C7942.4,407.9,7468.5,418.1,7276.5,381.4z M8146.7,23.9C8835.2-162,9354-697.3,9529.7-1400c61.3-247.2,61.3-659.8-2-892.7c-94-349.3-239-610.8-482.1-868.2c-239-251.3-512.8-418.8-862.1-527.1c-165.4-51.1-208.4-55.2-527-55.2c-320.7,0-361.6,4.1-531.1,57.2c-688.5,210.4-1191,751.8-1350.3,1452.5c-53.1,237-49,598.5,10.2,837.6c91.9,365.7,312.5,739.5,584.3,984.6c251.2,226.7,635.3,414.7,970.3,473.9C7523.7,95.4,7958.8,74.9,8146.7,23.9z"/><path d="M7568.6-21.1c-32.7-32.7-32.7-245.1,0-277.8c26.6-26.6,114.4-32.7,167.5-12.3c24.5,10.2,32.7,42.9,32.7,151.2c0,108.3-8.2,141-32.7,151.2C7683,11.6,7595.2,5.5,7568.6-21.1z"/><path d="M8255-613.5c-28.6-24.5-635.3-1062.3-690.4-1182.8c-22.5-47,6.1-130.8,275.8-827.4c165.4-424.9,314.6-790.6,332.9-809c16.4-20.4,53.1-36.8,79.7-36.8c53.1,0,128.7,65.4,128.7,114.4c0,16.4-128.7,361.6-286,764l-284,733.4l286,496.4c373.8,645.5,369.7,637.4,347.3,696.6C8416.4-589,8318.3-564.5,8255-613.5z"/><path d="M5840.4-1757.5c-81.7-114.4-20.4-200.2,141-200.2s222.7,85.8,141,200.2c-24.5,36.8-51.1,44.9-141,44.9C5891.4-1712.5,5864.9-1720.7,5840.4-1757.5z"/><path d="M9202.9-1737.1c-32.7-32.7-32.7-163.4,0-196.1c14.3-14.3,73.5-24.5,130.7-24.5c124.6,0,171.6,34.7,171.6,122.6c0,87.8-47,122.6-171.6,122.6C9276.4-1712.5,9217.2-1722.8,9202.9-1737.1z"/><path d="M7566.6-3375.4c-14.3-18.4-22.5-81.7-18.4-159.3l6.2-128.7h102.1h102.1l6.1,128.7c4.1,77.6-4.1,141-18.4,159.3C7715.7-3338.6,7597.2-3338.6,7566.6-3375.4z"/><path d="M2467.6-172.2C1317.5-640.1,1000.9-815.7,735.3-1132.4c-320.7-380-551.6-970.3-610.8-1564.8l-24.5-241l49-49c112.4-108.3,749.7-292.1,1348.3-388.1c345.2-57.2,706.8-98,1215.5-138.9c639.4-51.1,2951.9-24.5,3011.1,36.8c4.1,4.1-10.2,28.6-32.7,55.2c-222.7,247.2-457.6,768.1-529.1,1178.7c-40.8,232.9-28.6,745.6,20.4,966.3c71.5,310.5,234.9,659.8,433.1,923.4c49,67.4,89.9,126.7,89.9,132.8s-75.6,40.9-167.5,75.6l-169.5,67.4l-51.1-67.4c-512.8-668-1297.2-872.3-1959.1-510.7c-226.8,122.6-494.4,355.4-608.8,531.1c-18.4,26.6-36.8,47-44.9,45C2698.5-80.3,2592.3-123.2,2467.6-172.2z"/></g></g>
</svg></div><span class="ct-character-header-desktop__button-label">Status Effects</span></div>`

	let insertAfter = ($('.ct-character-header-desktop__group--gap').length > 0) ? '.ct-character-header-desktop__group--gap' : '.ct-character-header-tablet__group--gap';
	$(statusButton).insertAfter(insertAfter);

	$('.ct-character-header-desktop__button.statusEffects').off().on("click", function(){
		setTimeout(function(){	
			$(`.ct-initiative-box`).click();
			buildStatusButtons();
		}, 200)	
	});

	$('#statussite *:not(.ct-sidebar__pane *)').click(function(event) {
			if($(event.target).parents('.ct-sidebar__inner').length == 0)
				$('#statusstatusEffectsPanel').remove();	
	
	});
}

function buildStatusButtons(){
	let sidebarPanel = $(`

<div id='statusEffectsPanel'>
	<div class="ddbc-collapsible  ddbc-collapsible--collapsed">
		<div class="ddbc-collapsible__header">
			<div class="ddbc-collapsible__header-content ">
				<div class="ddbc-collapsible__header-content-primary">
					<div class="ddbc-collapsible__heading">
						Spells
					</div>
				</div>
			</div>
			<div class="ddbc-collapsible__header-status">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" class="ddbc-svg ddbc-chevron-svg ddbc-chevron-up-svg ddbc-svg--light"><path fill="#statusfff" d="M109,1138.5l742-741c12.7-12.7,27.7-19,45-19s32.3,6.3,45,19l742,741c12.7,12.7,19,27.8,19,45.5 c0,17.7-6.3,32.8-19,45.5l-166,165c-12.7,12.7-27.7,19-45,19s-32.3-6.3-45-19l-531-531l-531,531c-12.7,12.7-27.7,19-45,19 s-32.3-6.3-45-19l-166-165c-12.7-12.7-19-27.8-19-45.5C90,1166.3,96.3,1151.2,109,1138.5z"></path></svg>
			</div>
		</div>
		<div class="ddbc-collapsible__content">
			<div class="ct-decoration-manager">
				<div class="ct-decoration-manager__group">
					<div class="ct-decoration-manager__list spell"></div>
				</div>
			</div>
		</div>
	</div>

	<div class="ddbc-collapsible  ddbc-collapsible--collapsed">
		<div class="ddbc-collapsible__header">
			<div class="ddbc-collapsible__header-content ">
				<div class="ddbc-collapsible__header-content-primary">
					<div class="ddbc-collapsible__heading">
						Class Abilities
					</div>
				</div>
			</div>
			<div class="ddbc-collapsible__header-status">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" class="ddbc-svg ddbc-chevron-svg ddbc-chevron-up-svg ddbc-svg--light"><path fill="#statusfff" d="M109,1138.5l742-741c12.7-12.7,27.7-19,45-19s32.3,6.3,45,19l742,741c12.7,12.7,19,27.8,19,45.5 c0,17.7-6.3,32.8-19,45.5l-166,165c-12.7,12.7-27.7,19-45,19s-32.3-6.3-45-19l-531-531l-531,531c-12.7,12.7-27.7,19-45,19 s-32.3-6.3-45-19l-166-165c-12.7-12.7-19-27.8-19-45.5C90,1166.3,96.3,1151.2,109,1138.5z"></path></svg>
			</div>
		</div>
		<div class="ddbc-collapsible__content">
			<div class="ct-decoration-manager">
				<div class="ct-decoration-manager__group">
					<div class="ct-decoration-manager__list class"></div>
				</div>
			</div>
		</div>
	</div>


	<div class="ddbc-collapsible  ddbc-collapsible--collapsed">
		<div class="ddbc-collapsible__header">
			<div class="ddbc-collapsible__header-content ">
				<div class="ddbc-collapsible__header-content-primary">
					<div class="ddbc-collapsible__heading">
						Feats
					</div>
				</div>
			</div>
			<div class="ddbc-collapsible__header-status">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1792 1792" class="ddbc-svg ddbc-chevron-svg ddbc-chevron-up-svg ddbc-svg--light"><path fill="#statusfff" d="M109,1138.5l742-741c12.7-12.7,27.7-19,45-19s32.3,6.3,45,19l742,741c12.7,12.7,19,27.8,19,45.5 c0,17.7-6.3,32.8-19,45.5l-166,165c-12.7,12.7-27.7,19-45,19s-32.3-6.3-45-19l-531-531l-531,531c-12.7,12.7-27.7,19-45,19 s-32.3-6.3-45-19l-166-165c-12.7-12.7-19-27.8-19-45.5C90,1166.3,96.3,1151.2,109,1138.5z"></path></svg>
			</div>
		</div>
		<div class="ddbc-collapsible__content">
			<div class="ct-decoration-manager">
				<div class="ct-decoration-manager__group">
					<div class="ct-decoration-manager__list feat"></div>
				</div>
			</div>
		</div>
	</div>
</div>
`);
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
					<div class="ct-condition-manage-pane__condition-toggle" data-name='${i}'>
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
					<div class="ct-condition-manage-pane__condition-toggle" data-name='${i}'>
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
		
		if($('#statusstatusEffectsPanel').length == 0)
			$(".ct-sidebar__pane-content").prepend(sidebarPanel);	
		

		
		$(button).find(`select[data-name]`).change(function(e){
			  let optionSelected = $("option:selected", this);
    		let valueSelected = this.value;
    		let feature = $(this).attr('data-name');
    		for(mod in window.temporaryEffects[feature].dropdownOptions){
    			for(value in window.temporaryEffects[feature][mod]){
    				window.temporaryEffects[feature][mod][value] = valueSelected;
    			}
    		}
    		applyTemporaryEffects(e, feature);
		});
		$(button).find('.ct-condition-manage-pane__condition-toggle').off().on('click', function(e){
			if(e.target.tagName == 'SELECT'){
				e.stopImmediatePropagation();
				return;
			}
			applyTemporaryEffects(e);
			
		});
		$(sidebarPanel).find('.ddbc-collapsible').off().on('click', function(e){
			$(this).toggleClass('ddbc-collapsible--opened');
			$(this).toggleClass('ddbc-collapsible--collapsed');
		});
	}	
}

function applyTemporaryEffects(event, feature = $(event.currentTarget).attr("data-name")){

		//	$(`.ct-initiative-box`).click();
		//	let ddbLoading = `<div class="ct-loading-blocker " style='width:100%; height: 100%; background: #status3338; transform: none; position:fixed; top:0px; left:0px;'><div class="ct-loading-blocker__logo"></div><iframe class="ddbc-animated-loading-ring-svg ct-loading-blocker__anim" frameborder="0" title="loading" src="data:text/html;base64,PGh0bWw+PGhlYWQ+PHN0eWxlPioge21hcmdpbjowfTwvc3R5bGU+PC9oZWFkPjxib2R5IHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDsiPgogICAgICAgICAgICAgICAgICAgIDxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIGNsYXNzPSJ1aWwtcmluZy1hbHQiPgogICAgICAgICAgICAgICAgICAgICAgICA8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0ibm9uZSIgY2xhc3M9ImJrIi8+CiAgICAgICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQwIiBzdHJva2U9IiMxMzEzMTUiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMTAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogICAgICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgc3Ryb2tlPSIjRUMyMTI3IiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJzdHJva2UtZGFzaG9mZnNldCIgZHVyPSIycyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGZyb209IjAiIHRvPSI1MDIiLz4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InN0cm9rZS1kYXNoYXJyYXkiIGR1cj0iMnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiB2YWx1ZXM9IjE1MC42IDEwMC40OzEgMjUwOzE1MC42IDEwMC40Ii8+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvY2lyY2xlPgogICAgICAgICAgICAgICAgICAgIDwvc3ZnPjwvYm9keT48L2h0bWw+" style="background-color: transparent;"></iframe></div>`
			//$('#statussite').append(ddbLoading);
			//MAGIC ARMOR BUTTONS
			//$(`.ct-condition-manage-pane__condition-heading[data-name='${feature}'] .ddbc-toggle-field`).toggleClass('ddbc-toggle-field--is-enabled');
		//	$(`.ct-condition-manage-pane__condition-heading[data-name='${feature}'] .ddbc-toggle-field`).toggleClass('ddbc-toggle-field--is-disabled');
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


			if(window.temporaryEffects[feature].applied && (window.temporaryEffects[feature]['tohit'] != undefined || window.temporaryEffects[feature]['damage'] != undefined || window.temporaryEffects[feature]['noteRoll'] != undefined)){
				removeAttackBonus(window.temporaryEffects[feature]);
				$('.above-vtt-visited').toggleClass('above-vtt-visited', false)
				window.loopingAttacks = true;
			}
			else if(window.temporaryEffects[feature]['tohit'] != undefined || window.temporaryEffects[feature]['damage'] != undefined || window.temporaryEffects[feature]['noteRoll'] != undefined){
				setAttackBonus(window.temporaryEffects[feature]);		
				window.loopingAttacks = true;	
			}

			if(window.temporaryEffects[feature].applied == true){
				delete window.temporaryEffects[feature].applied
			}
			else{
				window.temporaryEffects[feature].applied = true;
			}


		
		



			let savedData = JSON.stringify(window.temporaryEffects);
			console.log('status saved', savedData);
			localStorage.setItem('temporaryEffects', savedData); 
}

/** Attempts to read the player name and image from the page every.
 * This will retry every second until it successfully reads from the page
 * @param {function} callback a function to execute after player name and image have been read from the page */
function set_window_name_and_image(callback) {
  if (window.set_window_name_and_image_attempts > 30) {
    console.warn(`set_window_name_and_image has failed after 30 attempts. window.PLAYER_NAME: ${window.PLAYER_NAME}, window.PLAYER_IMG: ${window.PLAYER_IMG}`);
    delete window.set_window_name_and_image_attempts;
    
    return;
  }

  console.debug("set_window_name_and_image");

  window.PLAYER_NAME = $(".ddb-character-app-sn0l9p").text();
  try {
    // This should be just fine, but catch any parsing errors just in case
    window.PLAYER_IMG = $(".ddbc-character-avatar__portrait").css("background-image").slice(4, -1).replace(/"/g, "");
  } catch {}

  if (typeof window.PLAYER_NAME !== "string" || window.PLAYER_NAME.length <= 1 || typeof window.PLAYER_IMG !== "string" || window.PLAYER_IMG.length <= 1) {
    // try again
    if (!window.set_window_name_and_image_attempts) {
      window.set_window_name_and_image_attempts = 1;
    }
    window.set_window_name_and_image_attempts += 1
    setTimeout(function() {
      set_window_name_and_image(callback);
    }, 1000);
  } else {
    // we're done
    if (typeof callback === "function") {
      callback();
    }
    delete window.set_window_name_and_image_attempts;
  }
   let urlSplit = window.location.href.split("/");
  if(urlSplit.length > 0) {
    window.PLAYER_ID = urlSplit[urlSplit.length - 1].split('?')[0];
  }
}

/**
* Observers character sheet for Dice Roll formulae.
* @param {DOMObject} documentToObserve documentToObserve is `$(document)` on the characters page, and `$(event.target).contents()` every where else
*/
function observe_character_sheet_dice_rolls(documentToObserve) {
 		
	 	const dice_roll_observer = new MutationObserver(function() {
        const notes = documentToObserve.find(".ddbc-note-components__component:not('.above-vtt-visited')");
        notes.each(function() {
            $(this).addClass("above-vtt-visited");
            try {
                const text = $(this).text();
                if (text.match(statusdiceRollCommandRegex)?.[0]) {
                		const diceRollImageIndex = $('.ddbc-character-avatar__portrait').attr('style').indexOf('https:/');
                		const diceRollImageUrl = $('.ddbc-character-avatar__portrait').attr('style').substring(diceRollImageIndex, $('.ddbc-character-avatar__portrait').attr('style').length - 3);
                    const diceRoll = statusDiceRoll.fromSlashCommand(text, $('.ddbc-character-tidbits__heading').text(), diceRollImageUrl);
                    const button = $(`<button class='avtt-roll-formula-button integrated-dice__container' title="${diceRoll.action?.toUpperCase() ?? "CUSTOM"}: ${diceRoll.rollType?.toUpperCase() ?? "ROLL"}">${diceRoll.expression}</button>`);
                    button.on("click", function (clickEvent) {
                        clickEvent.stopPropagation();
                        window.statusDiceRoller.roll(diceRoll);
                    });
                    $(this).empty();
                    $(this).append(button);
                }
            } catch (e) {
                console.warn("Failed to parse DiceRoll expression", e);
            }
        });
    });

    const mutation_target = documentToObserve.get(0);
    const mutation_config = { attributes: false, childList: true, characterData: false, subtree: true };
    dice_roll_observer.observe(mutation_target, mutation_config);
}


let observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (!mutation.addedNodes) return

    for (let i = 0; i < mutation.addedNodes.length; i++) {
      // do things to your newly added nodes here
      let node = mutation.addedNodes[i]
      if (node.className == 'ct-character-sheet-desktop' || node.className == 'ct-character-sheet-tablet'){
      	buildStatus();
      	observe_character_sheet_dice_rolls($(document));
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
	if (window.chatObserver === undefined) {
		window.chatObserver = new ChatObserver();
	}
	window.chatObserver.observe($("#statuschat-text"));







