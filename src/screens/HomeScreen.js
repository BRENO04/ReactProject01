import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { MagnifyingGlass } from 'phosphor-react-native';
import RotatingBanner from '../components/RotatingBanner';

const { width } = Dimensions.get('window');

const categorias = [
  { id: 'vinhos', nome: 'Vinhos', icone: require('../../assets/vinhosCategoria10.jpg') },
  { id: 'cervejas', nome: 'Cervejas', icone: require('../../assets/cervejasCategoria1.jpg') },
  { id: 'destilados', nome: 'Destilados', icone: require('../../assets/whiskysCategoria1.jpg') },
  { id: 'refrigerantes', nome: 'Refrigerantes', icone: require('../../assets/refrigerantesCategoria3.jpg') },
  { id: 'nao_alcoolicos', nome: 'Não Alcoólicos', icone: require('../../assets/naoAlcoolicos1.jpg') },
  { id: 'snacks', nome: 'Snacks', icone: require('../../assets/SnacksCategoria.jpg') },
];

const bebidas = [
  { id: '1', nome: 'Coca-Cola Lata', descricao: '350 ML', imagem: require('../../assets/cocalata2.jpg'), preco: 3.49, categoria: 'refrigerantes' },
  { id: '2', nome: 'Heineken', descricao: '330 ML', imagem: require('../../assets/heineken2.jpg'), preco: 6.99, categoria: 'cervejas' },
  { id: '3', nome: 'Skol', descricao: '350 ML', imagem: require('../../assets/skollata.jpg'), preco: 2.99, categoria: 'cervejas' },
  { id: '4', nome: 'Skol garrafa', descricao: '350 ML', imagem: require('../../assets/skolgarrafa.jpg'), preco: 3.99, categoria: 'cervejas' },
  { id: '5', nome: 'Red Bull', descricao: '250 ML', imagem: require('../../assets/redbull2.jpg'), preco: 7.99, categoria: 'nao_alcoolicos' },
  { id: '6', nome: 'Monster', descricao: '200 ML', imagem: require('../../assets/Monster2.jpg'), preco: 7.49, categoria: 'nao_alcoolicos' },
  { id: '7', nome: 'Budweiser', descricao: '350 ML', imagem: require('../../assets/budweiser2.jpg'), preco: 6.99, categoria: 'cervejas' },
  { id: '8', nome: 'Imperio', descricao: '300 ML', imagem: require('../../assets/imperio2.jpg'), preco: 3.49, categoria: 'cervejas' },
  { id: '9', nome: 'Glacial', descricao: '250 ML', imagem: require('../../assets/glacial2.jpg'), preco: 2.49, categoria: 'cervejas' },
  { id: '10', nome: 'Coca-Cola', descricao: '2 L', imagem: require('../../assets/cocagarrafa.jpg'), preco: 9.99, categoria: 'refrigerantes' },
  { id: '11', nome: 'Whisky Red Label', descricao: '1L', imagem: require('../../assets/whisky2.jpg'), preco: 90.00, categoria: 'destilados' },
  { id: '12', nome: 'Cachaça 51', descricao: '1L', imagem: require('../../assets/cana51.jpg'), preco: 14.99, categoria: 'destilados' },
  { id: '13', nome: 'Doritos', descricao: '120g', imagem: require('../../assets/snacks1.jpg'), preco: 12.99, categoria: 'snacks' },
  { id: '14', nome: 'Rufles', descricao: '68g', imagem: require('../../assets/snacks2.jpg'), preco: 9.99, categoria: 'snacks' },
  { id: '15', nome: 'Torcida', descricao: '35g', imagem: require('../../assets/snacks3.jpg'), preco: 1.99, categoria: 'snacks' },
  { id: '16', nome: 'Cheetos Parmesão', descricao: '160', imagem: require('../../assets/snacks4.jpg'), preco: 9.99, categoria: 'snacks' },
  { id: '17', nome: 'Cheetos requeijão', descricao: '160g', imagem: require('../../assets/snacks5.jpg'), preco: 9.99, categoria: 'snacks' },
  { id: '18', nome: 'KitKat', descricao: '45g', imagem: require('../../assets/snacks6.jpeg'), preco: 2.99, categoria: 'snacks' },
  { id: '19', nome: 'Bis', descricao: '126g', imagem: require('../../assets/snacks7.jpg'), preco: 7.99, categoria: 'snacks' },
  { id: '20', nome: 'Chocolate Lacta', descricao: '98g', imagem: require('../../assets/snacks8.jpg'), preco: 6.99, categoria: 'snacks' },
  { id: '21', nome: 'Biscoito PassaTempo', descricao: '90g', imagem: require('../../assets/snacks9.jpg'), preco: 2.99, categoria: 'snacks' },
  { id: '22', nome: 'Biscoito Oreo', descricao: '90g', imagem: require('../../assets/snacks10.jpg'), preco: 2.99, categoria: 'snacks' },
  { id: '23', nome: 'Vinho Tinto Seco Miolo', descricao: '750ML', imagem: require('../../assets/vinho001.jpg'), preco: 29.99, categoria: 'vinhos' },
  { id: '24', nome: 'Vinho Branco Seco Miolo', descricao: '750ML', imagem: require('../../assets/vinho002.jpg'), preco: 29.99, categoria: 'vinhos' },
  { id: '25', nome: 'Vinho Tinto Suave Nuances', descricao: '750ML', imagem: require('../../assets/vinho003.jpg'), preco: 29.99, categoria: 'vinhos' },
  { id: '26', nome: 'Vinho Tinto Suave Miolo', descricao: '750ML', imagem: require('../../assets/vinho003.jpg'), preco: 29.99, categoria: 'vinhos' },
];

const CategoriasList = ({ navigation }) => (
  <View style={styles.categoriasContainer}>
    <FlatList
      data={categorias}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoriasList}
      renderItem={({ item }) => {
        const produtosFiltrados = bebidas.filter(bebida => bebida.categoria === item.id);
        if (produtosFiltrados.length === 0) {
          console.warn(`Nenhum produto encontrado para a categoria ${item.id}`);
          return null;
        }

        return (
          <TouchableOpacity
            style={styles.categoriaCard}
            onPress={() => {
              navigation.navigate('Categoria', {
                categoria: item.id,
                titulo: item.nome,
                produtos: produtosFiltrados
              });
            }}
          >
            <Image source={item.icone} style={styles.categoriaImagem} resizeMode="cover" />
            <Text style={styles.categoriaNome}>{item.nome}</Text>
          </TouchableOpacity>
        );
      }}
    />
  </View>
);

const Header = ({ searchQuery, setSearchQuery, searchInputRef }) => (
  <View style={styles.header}>
    <Image source={require('../../assets/marcoaLogo2.png')} style={styles.logo} />
    <View style={styles.searchContainer}>
      <TextInput
        ref={searchInputRef}
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Buscar produto..."
        placeholderTextColor="#888"
        autoCapitalize="none"
        returnKeyType="search"
        onSubmitEditing={() => console.log('Busca submetida:', searchQuery)}
      />
      <TouchableOpacity onPress={() => searchInputRef.current?.focus()}>
        <MagnifyingGlass size={30} color="white" weight="bold" />
      </TouchableOpacity>
    </View>
  </View>
);

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  const filteredBebidas = bebidas.filter(bebida =>
    bebida.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bebida.descricao.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBebidaItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Detalhes', { bebida: item })}
      style={styles.bebidaItem}
      accessibilityLabel={`Ver detalhes de ${item.nome}`}
      accessibilityHint="Toque para ver mais informações sobre a bebida"
    >
      <View style={styles.bebidaCard}>
        {item.imagem ? (
          <Image source={item.imagem} style={styles.bebidaImagem} resizeMode="cover" />
        ) : (
          <View style={[styles.bebidaImagem, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>?</Text>
          </View>
        )}
        <Text style={styles.bebidaNome} numberOfLines={1}>{item.nome}</Text>
        <Text style={styles.bebidaDescricao}>{item.descricao}</Text>
      </View>
    </TouchableOpacity>
  );

  const sections = [
    { type: 'header', key: 'header' },
    { type: 'categorias', key: 'categorias' },
    { type: 'banner', key: 'banner' },
    { type: 'bebidas_title', key: 'bebidas_title' },
    { type: 'bebidas', key: 'bebidas', data: filteredBebidas },
  ];

  const renderSection = ({ item }) => {
    switch (item.type) {
      case 'header':
        return <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchInputRef={searchInputRef} />;
      case 'categorias':
        return <CategoriasList navigation={navigation} />;
      case 'banner':
        return <RotatingBanner />;
      case 'bebidas_title':
        return <Text style={styles.bebidasTitle}>Variedades</Text>;
      case 'bebidas':
        return (
          <FlatList
            data={item.data}
            renderItem={renderBebidaItem}
            keyExtractor={(bebida) => bebida.id.toString()}
            numColumns={2}
            style={styles.bebidasGrid}
            columnWrapperStyle={styles.bebidasRow}
            ListEmptyComponent={
              searchQuery ? <Text style={styles.emptyListText}>Nenhum produto encontrado para "{searchQuery}".</Text> : null
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  logo: {
    width: 150,
    height: 45,
    resizeMode: 'cover',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: 'white',
    width: 150,
    marginRight: 10,
  },
  categoriasContainer: {
    paddingLeft: 15,
    paddingVertical: 15,
  },
  categoriasList: {},
  categoriaCard: {
    alignItems: 'center',
    marginRight: 15,
    width: 80,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  categoriaImagem: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  categoriaNome: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bebidasTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    marginBottom: 15,
    marginLeft: 15,
  },
  bebidasGrid: {
    paddingHorizontal: 10,
  },
  bebidasRow: {
    justifyContent: 'space-between',
  },
  bebidaItem: {
    width: (width - 40) / 2,
    marginBottom: 15,
  },
  bebidaCard: {
    backgroundColor: '#1C1C1C',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    width: '100%',
  },
  bebidaImagem: {
    width: '90%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bebidaNome: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  bebidaDescricao: {
    fontSize: 12,
    color: '#cccccc',
    textAlign: 'center',
  },
  placeholderImage: {
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyListText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    paddingHorizontal: 20,
  },
});