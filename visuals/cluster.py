import pandas as pd
from io import StringIO
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
import plotly.express as px
import numpy as np

# Load your data
try:
    with open('/Users/jeffhykin/repos/risma/scripts/terms.ignore.tsv', 'r') as f:
        csv_string = f.read()
except:
    csv_string = None

df = pd.read_csv(StringIO(csv_string), sep="\t")

# Separate system identifiers and features
system_names = df['Name']
X = df.drop(columns=['Name'])

# Normalize the data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Perform K-Means clustering
kmeans = KMeans(n_clusters=2, random_state=42)
clusters = kmeans.fit_predict(X_scaled)
df['cluster'] = clusters

# Apply PCA with 3 components
pca = PCA(n_components=3)
X_pca = pca.fit_transform(X_scaled)
df['PCA1'] = X_pca[:, 0]
df['PCA2'] = X_pca[:, 1]
df['PCA3'] = X_pca[:, 2]

# 3D Scatter Plot
fig = px.scatter_3d(
    df, x='PCA1', y='PCA2', z='PCA3',
    color=df['cluster'].astype(str),
    hover_name='Name',
    title='3D PCA: System Clustering Based on Word Frequencies',
    labels={'cluster': 'Cluster'}
)
fig.show()

# Identify top contributing terms for each PCA component
components = pca.components_
feature_names = X.columns
top_n = 5  # Number of top features to show per component

print("\nTop contributing terms per PCA component:")
for i, component in enumerate(components):
    indices = np.argsort(np.abs(component))[::-1][:top_n]
    terms = [(feature_names[idx], component[idx]) for idx in indices]
    print(f"\nPCA Component {i+1}:")
    for term, loading in terms:
        print(f"  {term}: {loading:.4f}")



# import pandas as pd
# from io import StringIO
# from sklearn.preprocessing import StandardScaler
# from sklearn.cluster import KMeans
# import matplotlib.pyplot as plt
# from sklearn.decomposition import PCA
# import pandas as pd
# from io import StringIO
# from sklearn.preprocessing import StandardScaler
# from sklearn.cluster import KMeans
# from sklearn.decomposition import PCA
# import plotly.express as px

# import pandas as pd
# import numpy as np
# from gensim.models import KeyedVectors
# from sklearn.decomposition import PCA
# from sklearn.cluster import KMeans

# from gensim.downloader import load
# word_vectors = load("word2vec-google-news-300")

# # Example CSV string (replace this with your actual CSV string)
# try:
#     with open('/Users/jeffhykin/repos/risma/scripts/terms.ignore.tsv','r') as f:
#         csv_string = f.read()
# except:
#     csv_string = None

# # Step 1: Load CSV string into a DataFrame
# df = pd.read_csv(StringIO(csv_string), sep="\t")

# # Separate system identifiers and features
# system_names = df['Name']
# X = df.drop(columns=['Name'])

# # Normalize the data
# scaler = StandardScaler()
# X_scaled = scaler.fit_transform(X)

# # Perform K-Means clustering
# kmeans = KMeans(n_clusters=2, random_state=42)
# clusters = kmeans.fit_predict(X_scaled)
# df['cluster'] = clusters

# # Reduce dimensions for visualization using PCA
# pca = PCA(n_components=2)
# X_pca = pca.fit_transform(X_scaled)
# df['PCA1'] = X_pca[:, 0]
# df['PCA2'] = X_pca[:, 1]

# # Plot using Plotly
# fig = px.scatter(
#     df, x='PCA1', y='PCA2',
#     color=df['cluster'].astype(str),
#     hover_name='Name',
#     title='System Clustering Based on Word Frequencies',
#     labels={'cluster': 'Cluster'}
# )
# fig.show()

# import numpy as np
# # Get feature names
# feature_names = X.columns

# # 1. Analyze KMeans cluster centers
# centroid_diff = np.abs(kmeans.cluster_centers_[0] - kmeans.cluster_centers_[1])
# influential_features_kmeans = pd.Series(centroid_diff, index=feature_names).sort_values(ascending=False)

# print("\nTop 10 influential features based on cluster centroid differences:")
# print(influential_features_kmeans.head(10))

# # 2. Analyze PCA components
# pca_components = pd.DataFrame(np.abs(pca.components_), columns=feature_names, index=['PCA1', 'PCA2'])
# influential_features_pca = pca_components.T.sum(axis=1).sort_values(ascending=False)

# print("\nTop 10 influential features based on PCA components:")
# print(influential_features_pca.head(10))


# pca_components = pd.DataFrame(
#     pca.components_,
#     columns=X.columns,
#     index=['PCA1', 'PCA2']
# )

# # Get the top contributing features for each component
# def describe_component(component, n=5):
#     sorted_loadings = component.sort_values(ascending=False)
#     top_positive = sorted_loadings.head(n)
#     top_negative = sorted_loadings.tail(n)
#     description = {
#         'top_positive': top_positive,
#         'top_negative': top_negative
#     }
#     return description

# # Describe PCA1
# print("Top features influencing PCA1:")
# desc_pca1 = describe_component(pca_components.loc['PCA1'])
# print("\nTop positive contributors to PCA1:")
# print(desc_pca1['top_positive'])
# print("\nTop negative contributors to PCA1:")
# print(desc_pca1['top_negative'])

# # Describe PCA2
# print("\n\nTop features influencing PCA2:")
# desc_pca2 = describe_component(pca_components.loc['PCA2'])
# print("\nTop positive contributors to PCA2:")
# print(desc_pca2['top_positive'])
# print("\nTop negative contributors to PCA2:")
# print(desc_pca2['top_negative'])


# # Prepare vectors for each term
# def get_term_vector(term):
#     if term in word_vectors:
#         return word_vectors[term]
#     else:
#         return None

# # Separate names and term frequency data
# names = df["Name"]
# term_df = df.drop(columns=["Name"])

# # Filter terms that exist in word2vec
# valid_terms = [term for term in term_df.columns if term in word_vectors]
# term_df = term_df[valid_terms]

# # Compute system vectors as weighted sum of word2vec embeddings
# system_vectors = []
# for _, row in term_df.iterrows():
#     vector = np.zeros(300)
#     for term in valid_terms:
#         freq = row[term]
#         if freq > 0:
#             weight = np.log1p(freq)  # log(1 + freq) to avoid log(0)
#             vector += word_vectors[term] * weight
#     system_vectors.append(vector)

# system_vectors = np.array(system_vectors)

# # Reduce to 3D
# pca = PCA(n_components=3)
# system_vectors_3d = pca.fit_transform(system_vectors)

# # Cluster systems
# k = 3  # or change as needed
# kmeans = KMeans(n_clusters=k, random_state=42)
# labels = kmeans.fit_predict(system_vectors_3d)

# # Combine into result DataFrame
# result = pd.DataFrame(system_vectors_3d, columns=["PC1", "PC2", "PC3"])
# result["Cluster"] = labels
# result["Name"] = names.values

# # Print result
# print(result[["Name", "PC1", "PC2", "PC3", "Cluster"]])

# import plotly.express as px

# # Create 3D scatter plot
# fig = px.scatter_3d(
#     result,
#     x="PC1", y="PC2", z="PC3",
#     color="Cluster",
#     text="Name",  # This shows the name on hover
#     title="3D PCA of Brain Systems with Clustering",
#     labels={"PC1": "Principal Component 1", "PC2": "Principal Component 2", "PC3": "Principal Component 3"},
# )

# fig.update_traces(marker=dict(size=5), textposition="top center")
# fig.update_layout(margin=dict(l=0, r=0, b=0, t=40))
# fig.show()
# fig.write_html("brain_systems_clusters_3D.html")


# describe_component(pca.loc['PC1'])


# components = pca.components_  # shape: (n_components, n_features)
# feature_names = list(valid_terms)  # your terms

# # Show top N terms per component
# top_n = 10
# for i, component in enumerate(components[:3]):  # For first 3 components
#     print(f"\nTop {top_n} influential terms for Principal Component {i+1}:")
#     indices = np.argsort(np.abs(component))[::-1][:top_n]
#     print(f'''indices = {indices}''')
#     for idx in indices:
#         term = feature_names[idx]
#         weight = component[idx]
#         print(f"{term}: {weight:.4f}")