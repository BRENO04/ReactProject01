import React, { useState, useMemo } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, ScrollView, FlatList, Alert, SafeAreaView } from 'react-native'; 
import { ArrowLeft } from 'phosphor-react-native';
import { useCart } from '../../context/CartContext'; 

const { width, height } = Dimensions.get('window');
const sugestoesExemplo = [
  
  { id: 's1', nome: 'Biscoito PassaTempo', imagem: require('../../assets/snacks9.jpg'), preco: 2.99 },
  { id: 's2', nome: 'Rufles', imagem: require('../../assets/snacks2.jpg'), preco: 9.99 },
  { id: 's3', nome: 'Skol Lata 350ml', imagem: require('../../assets/skollata.jpg'), preco: 2.99 },
  { id: 's4', nome: 'Cheetos Requeijão', imagem: require('../../assets/snacks5.jpg'), preco: 9.99 },
];

export default function Detalhes({ route, navigation }) {
  if (!route.params || !route.params.bebida) {
    console.error("Erro: Dados da bebida não recebidos na rota.");
    return (
        <SafeAreaView style={styles.safeAreaError}>
            <Text style={styles.errorText}>Erro ao carregar detalhes da bebida.</Text>
            <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.errorText}>Voltar</Text></TouchableOpacity>
        </SafeAreaView>
    );
  }
  const { bebida } = route.params;
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const precoNumerico = useMemo(() => Number(bebida.preco) || 0, [bebida.preco]);

  const handleAddToCart = () => {
    if (precoNumerico <= 0) {
        Alert.alert("Erro", "Preço do produto inválido. Não é possível adicionar à sacola.");
        return;
    }
    if (!bebida.id) {
        Alert.alert("Erro", "ID do produto inválido. Não é possível adicionar à sacola.");
        return;
    }

    const itemParaAdicionar = {
      id: bebida.id, 
      nome: bebida.nome || 'Produto sem nome',
      preco: precoNumerico, 
      quantidade: quantity,
      imagem: bebida.imagem, 
    };
    addToCart(itemParaAdicionar);
    Alert.alert("Sucesso!", `${quantity} unidade(s) de ${bebida.nome} adicionada(s) à sacola.`);

  };

  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity style={styles.suggestionItem} onPress={() => navigation.push('Detalhes', { bebida: item })}>
        <Image 
            source={item.imagem || require('../../assets/placeHolder001.png')} //placeholder 
            style={styles.suggestionImage} 
            resizeMode="cover" 
        />
        <Text style={styles.suggestionName} numberOfLines={2}>{item.nome}</Text>
        <Text style={styles.suggestionPrice}>R$ {Number(item.preco || 0).toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <ArrowLeft size={30} color="white" weight="bold" />
                </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>
                {bebida.imagem ? (
                <Image source={bebida.imagem} style={styles.productImage} resizeMode="cover" />
                ) : (
                <View style={[styles.productImage, styles.placeholderImage]}>
                    <Text style={styles.placeholderText}>?</Text>
                </View>
                )}
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.productName}>{bebida.nome || 'Produto'} {bebida.descricao}</Text>

                <Text style={styles.productPrice}>R$ {precoNumerico.toFixed(2)}</Text>
            </View>

            <View style={styles.quantitySelectorContainer}>
                <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => setQuantity(Math.max(1, quantity - 1))} 
                    disabled={quantity <= 1}
                >
                    <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityDisplay}>{quantity}</Text>
                <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => setQuantity(quantity + 1)}
                >
                    <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                <Text style={styles.addButtonText}>Adicionar à sacola</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.viewCartButton}
                    onPress={() => navigation.navigate('Sacola')}
                >
                <Text style={styles.viewCartButtonText}>Ver Sacola</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>Que tal pedir também?</Text>
                <FlatList
                    data={sugestoesExemplo} 
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderSuggestionItem}
                    contentContainerStyle={{ paddingLeft: 10 }} 
                />
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
   safeAreaError: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
      color: 'red',
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  productImage: {
    width: width * 0.6, 
    height: height * 0.35, 
    borderRadius: 15,
  },
  placeholderImage: {
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center', 
  },
  productName: {
    fontSize: 22, 
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFA500', 
    textAlign: 'center',
    marginBottom: 15,
  },
  quantitySelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    marginBottom: 25,
    gap: 20, 
  },
  quantityButton: {
    backgroundColor: '#333', 
    width: 44, 
    height: 44,
    borderRadius: 22, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 26, 
  },
  quantityDisplay: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    minWidth: 40, 
    textAlign: 'center',
  },
  actionContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 14, 
    paddingHorizontal: 40,
    borderRadius: 10,
    width: '80%', 
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewCartButton: {
    backgroundColor: '#333',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  viewCartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  suggestionsContainer: {
    paddingBottom: 20, 
    marginTop: 10,
  },
  suggestionsTitle: {
    fontSize: 18, 
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    marginLeft: 15,
  },
  suggestionItem: {
    alignItems: 'center',
    width: 140, 
    marginRight: 15,
    backgroundColor: '#1C1C1C',
    borderRadius: 10,
    padding: 10,
  },
  suggestionImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  suggestionName: {
    fontSize: 13,
    color: 'white',
    textAlign: 'center',
    height: 35, 
    marginBottom: 4,
  },
  suggestionPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFA500',
    textAlign: 'center',
  },
});
