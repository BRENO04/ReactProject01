import React from 'react';
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
} from 'react-native';
import { ArrowLeft } from 'phosphor-react-native';

const { width } = Dimensions.get('window');

export default function CategoriaScreen({ route, navigation }) {

  const { categoria, titulo, produtos } = route.params || {};

  if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
    console.error("Erro: Dados de produtos inválidos ou ausentes:", route.params);
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={28} color="white" weight="bold" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Erro</Text>
          <View style={{ width: 28 }} />
        </View>
        <Text style={styles.errorText}>Nenhum produto disponível nesta categoria.</Text>
      </SafeAreaView>
    );
  }

  const renderBebidaItem = ({ item }) => {
    if (!item || typeof item !== 'object') {
      console.warn("Item inválido encontrado:", item);
      return null;
    }
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Detalhes', { bebida: item })}
        style={styles.bebidaItem}
        accessibilityLabel={`Ver detalhes de ${item.nome || 'produto desconhecido'}`}
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
          <Text style={styles.bebidaNome} numberOfLines={1}>{item.nome || 'Sem nome'}</Text>
          <Text style={styles.bebidaDescricao}>{item.descricao || 'Sem descrição'}</Text>
          <Text style={styles.bebidaPreco}>R$ {(item.preco || 0).toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={28} color="white" weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{titulo || 'Categoria'}</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.bannerContainer}>
        <Image
          source={require('../../assets/placeHolder001.png')}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.contentContainer}>
        <FlatList
          data={produtos}
          renderItem={renderBebidaItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          style={styles.bebidasGrid}
          columnWrapperStyle={styles.bebidasRow}
          ListEmptyComponent={<Text style={styles.emptyListText}>Nenhum produto encontrado nesta categoria.</Text>}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
    paddingVertical: 15,
    backgroundColor: '#111',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  bannerContainer: {
    width: '100%',
    height: 150,
    marginBottom: 15,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  bebidasGrid: {
    flex: 1,
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
    marginBottom: 4,
  },
  bebidaPreco: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFA500',
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
  errorText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    paddingHorizontal: 20,
  },
  emptyListText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    paddingHorizontal: 20,
  },
});