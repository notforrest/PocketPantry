import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Button, SectionList, StyleSheet, Text, View } from "react-native";

export default function ConfirmPage() {
  const { ingredients } = useLocalSearchParams<{ [key: string]: string[] }>();
  const [confirmedIngredients, setConfirmedIngredients] = useState<string[]>(
    [],
  );
  const [rejectedIngredients, setRejectedIngredients] = useState<string[]>([]);
  const [ingredientIndex, setIngredientIndex] = useState<number>(0);
  const [recipe, setRecipe] = useState<string>("");

  const generateRecipes = async () => {
    try {
      // Hardcoded Apple Pie recipe
      const applePieRecipe = `
        Apple Pie Recipe:
        Ingredients:
        - 6 cups sliced apples
        - 3/4 cup sugar
        - 1 tablespoon all-purpose flour
        - 1/2 teaspoon ground cinnamon
        - 1/4 teaspoon ground nutmeg
        - 1 tablespoon lemon juice
        - 1 package refrigerated pie crusts (2 crusts)
        - 1 tablespoon butter
        Instructions:
        1. Preheat oven to 425 degrees F (220 degrees C).
        2. Mix sugar, flour, cinnamon, nutmeg, and lemon juice in a bowl.
        3. Add apples to the mixture and toss until evenly coated.
        4. Fit 1 pie crust into a 9-inch pie dish. Spoon apple mixture into the crust.
        5. Cut butter into small pieces and dot the top of the apple mixture with butter.
        6. Place the second pie crust on top and crimp the edges to seal.
        7. Cut several slits in the top crust to vent steam.
        8. Bake in preheated oven for 45 to 50 minutes, or until crust is golden brown and filling is bubbly.
        9. Cool on a wire rack before serving. Enjoy!
      `;

      setRecipe(applePieRecipe);
    } catch (error) {
      console.error("Error generating recipe:", error);
    }
  };

  return (
    <View style={styles.container}>
      {ingredients && (
        <View>
          <Text style={styles.title}>Confirm Ingredients</Text>
          <Text style={styles.body}>{ingredients[ingredientIndex]}</Text>
          <View style={styles.buttons}>
            <Button
              title="Reject"
              onPress={() => {
                setRejectedIngredients([
                  ...rejectedIngredients,
                  ingredients[ingredientIndex],
                ]);
                setIngredientIndex(ingredientIndex + 1);
              }}
            />
            <Button
              title="Accept"
              onPress={() => {
                setConfirmedIngredients([
                  ...confirmedIngredients,
                  ingredients[ingredientIndex],
                ]);
                setIngredientIndex(ingredientIndex + 1);
              }}
            />
            <Button
              title="Accept All"
              onPress={() => {
                setConfirmedIngredients([
                  ...confirmedIngredients,
                  ...ingredients.slice(ingredientIndex),
                ]);
                setIngredientIndex(ingredients.length);
              }}
            />
          </View>
          {/* <Button title="Generate Recipes" onPress={generateRecipes} />
            <Text style={{ marginTop: 20, fontSize: 18, fontWeight: "bold" }}>
              Generated Recipe:
            </Text>
            <Text>{recipe}</Text> */}
        </View>
      )}
      <View style={styles.container}>
        <SectionList
          sections={[
            { title: "Accepted Ingredients", data: confirmedIngredients },
            { title: "Rejected Ingredients", data: rejectedIngredients },
          ]}
          renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          keyExtractor={(item, index) => item + index}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 24,
    textAlign: "center",
  },
  body: {
    fontSize: 18,
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    gap: 20,
    marginTop: 16,
    justifyContent: "center",
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "rgba(247,247,247,1.0)",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
