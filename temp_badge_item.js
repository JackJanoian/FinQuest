const BadgeItem = ({ name, description, earned, iconType, onPress, featured, special }) => (
  <TouchableOpacity 
    style={styles.badgeItem} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.badgeImageContainer}>
      {earned ? (
        <LinearGradient
          colors={
            featured ? ['#4CAF50', '#2E7D32'] : 
            special === 'automation' ? ['#2196F3', '#1565C0'] :
            special === 'freeze' ? ['#00BCD4', '#0097A7'] :
            special === 'emergency' ? ['#FF9800', '#FFC107'] :
            special === 'tracker' ? ['#4CAF50', '#2E7D32'] :
            special === 'chef' ? ['#FFC107', '#FFD54F'] :
            special === 'debt-payment' ? ['#FF9800', '#FFC107'] :
            special === 'debt-snowball' ? ['#4CAF50', '#2E7D32'] :
            special === 'debt-avalanche' ? ['#2196F3', '#1565C0'] :
            special === 'debt-free' ? ['#FFC107', '#FFD54F'] :
            special === 'card-crusher' ? ['#9C27B0', '#7B1FA2'] :
            special === 'budget-beginner' ? ['#3F51B5', '#303F9F'] :
            special === 'savings-superstar' ? ['#FF5722', '#E64A19'] :
            special === 'financial-master' ? ['#8BC34A', '#689F38'] :
            special === 'debt-demolisher' ? ['#F44336', '#D32F2F'] :
            ['#FFC107', '#FFD54F']
          }
          style={[
            styles.badgeImage, 
            featured && styles.featuredBadgeImage,
            special === 'automation' && styles.automationBadgeImage,
            special === 'freeze' && styles.freezeBadgeImage,
            special === 'emergency' && styles.emergencyBadgeImage,
            special === 'tracker' && styles.trackerBadgeImage,
            special === 'chef' && styles.chefBadgeImage,
            special === 'debt-payment' && styles.debtPaymentBadgeImage,
            special === 'debt-snowball' && styles.debtSnowballBadgeImage,
            special === 'debt-avalanche' && styles.debtAvalancheBadgeImage,
            special === 'debt-free' && styles.debtFreeBadgeImage,
            special === 'card-crusher' && styles.cardCrusherBadgeImage,
            special === 'budget-beginner' && styles.budgetBeginnerBadgeImage,
            special === 'savings-superstar' && styles.savingsSuperstarBadgeImage,
            special === 'financial-master' && styles.financialMasterBadgeImage,
            special === 'debt-demolisher' && styles.debtDemolisherBadgeImage
          ]}
        >
          <View style={styles.badgeIconContainer}>
            {BadgeIcons[iconType] ? BadgeIcons[iconType]() : <Text style={styles.badgeEmoji}>?</Text>}
          </View>
          {special === 'automation' && (
            <View style={styles.automationGearContainer}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.automationGear, { 
                  top: Math.random() * 60, 
                  left: Math.random() * 60,
                }]} />
              ))}
            </View>
          )}
          {special === 'freeze' && (
            <View style={styles.freezeEffectContainer}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.freezeCrystal, { 
                  top: Math.random() * 60, 
                  left: Math.random() * 60,
                  width: 4 + Math.random() * 4,
                  height: 4 + Math.random() * 4,
                }]} />
              ))}
            </View>
          )}
          {special === 'emergency' && (
            <View style={styles.emergencyEffectContainer}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.emergencyIcon, { 
                  top: Math.random() * 60, 
                  left: Math.random() * 60,
                }]} />
              ))}
            </View>
          )}
          {special === 'tracker' && (
            <View style={styles.trackerEffectContainer}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.trackerIcon, { 
                  top: Math.random() * 60, 
                  left: Math.random() * 60,
                }]} />
              ))}
            </View>
          )}
          {special === 'chef' && (
            <View style={styles.chefEffectContainer}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.chefIcon, { 
                  top: Math.random() * 60, 
                  left: Math.random() * 60,
                }]} />
              ))}
            </View>
          )}
          {special === 'debt-payment' && (
            <View style={styles.debtPaymentEffectContainer}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.debtPaymentIcon, { 
                  top: Math.random() * 60, 
                  left: Math.random() * 60,
                }]} />
              ))}
            </View>
          )}
          {special === 'debt-snowball' && (
            <View style={styles.debtSnowballEffectContainer}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.debtSnowballIcon, { 
                  top: Math.random() * 60, 
                  left: Math.random() * 60,
                }]} />
              ))}
            </View>
          )}
          {special === 'debt-avalanche' && (
            <View style={styles.debtAvalancheEffectContainer}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.debtAvalancheIcon, { 
                  top: Math.random() * 60, 
                  left: Math.random() * 60,
                }]} />
              ))}
            </View>
          )}
          {special === 'debt-free' && (
            <View style={styles.debtFreeEffectContainer}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.debtFreeIcon, { 
                  top: Math.random() * 60, 
                  left: Math.random() * 60,
                }]} />
              ))}
            </View>
          )}
          {special === 'card-crusher' && (
            <View style={styles.cardCrusherEffectContainer}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.cardCrusherIcon, { 
                  top: Math.random() * 60, 
                  left: Math.random() * 60,
                }]} />
              ))}
            </View>
          )}
          {special === 'budget-beginner' && (
            <View style={styles.budgetBeginnerEffectContainer}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.budgetBeginnerIcon, { 
                  top: Math.random() * 60, 
                  left: Math.random() * 60,
                }]} />
              ))}
            </View>
          )}
          {special === 'savings-superstar' && (
            <View style={styles.savingsSuperstarEffectContainer}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={[styles.savingsSuperstarIcon, { 
                  top: Math.random() * 60, 
                  left: Math.random() * 60,
                }]} />
              ))}
            </View>
          )}
          {special === 'financial-master' && (
            <View style={styles.financialMasterEffectContainer}>
              {[...Array(8)].map((_, i) => (
                <View key={i} style={[styles.financialMasterIcon, { 
                  top: Math.random() * 60, 
                  left: Math.random() * 60,
                  width: 4 + Math.random() * 4,
                  height: 4 + Math.random() * 4,
                  backgroundColor: ['#FFD700', '#FFC107', '#FF9800', '#8BC34A'][Math.floor(Math.random() * 4)]
                }]} />
              ))}
            </View>
          )}
          {special === 'debt-demolisher' && (
            <View style={styles.debtDemolisherEffectContainer}>
              {[...Array(8)].map((_, i) => (
                <View key={i} style={[styles.debtDemolisherIcon, { 
                  top: Math.random() * 60, 
                  left: Math.random() * 60,
                  width: 3 + Math.random() * 3,
                  height: 3 + Math.random() * 3,
                  backgroundColor: ['#F44336', '#E53935', '#D32F2F'][Math.floor(Math.random() * 3)]
                }]} />
              ))}
            </View>
          )}
          <View style={[
            styles.badgeGlowOuter,
            special === 'automation' && styles.automationGlowOuter,
            special === 'freeze' && styles.freezeGlowOuter,
            special === 'emergency' && styles.emergencyGlowOuter,
            special === 'tracker' && styles.trackerGlowOuter,
            special === 'chef' && styles.chefGlowOuter,
            special === 'debt-payment' && styles.debtPaymentGlowOuter,
            special === 'debt-snowball' && styles.debtSnowballGlowOuter,
            special === 'debt-avalanche' && styles.debtAvalancheGlowOuter,
            special === 'debt-free' && styles.debtFreeGlowOuter,
            special === 'card-crusher' && styles.cardCrusherGlowOuter,
            special === 'budget-beginner' && styles.budgetBeginnerGlowOuter,
            special === 'savings-superstar' && styles.savingsSuperstarGlowOuter,
            special === 'financial-master' && styles.financialMasterGlowOuter,
            special === 'debt-demolisher' && styles.debtDemolisherGlowOuter
          ]} />
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={['#BDBDBD', '#E0E0E0']}
          style={styles.lockedBadge}
        >
          <Text style={styles.lockedText}>?</Text>
        </LinearGradient>
      )}
      {/* All badge bubble title indicators have been removed */}
    </View>
    <Text style={styles.badgeName}>{name}</Text>
    {earned ? (
      <View style={styles.earnedIndicator} />
    ) : (
      <View style={styles.lockedIndicator}>
        <Text style={styles.lockedText}>Locked</Text>
      </View>
    )}
  </TouchableOpacity>
);
