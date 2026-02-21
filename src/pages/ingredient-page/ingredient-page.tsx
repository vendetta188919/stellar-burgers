import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '@ui';
import { IngredientDetailsUI } from '@ui';
import { useSelector } from '../../services/store';
import { ingredientByIdSelector } from '../../services/slices';
import styles from './ingredient-page.module.css';

export const IngredientPage: FC = () => {
  const { id } = useParams();
  const ingredientData = useSelector(ingredientByIdSelector(id));

  if (!ingredientData) {
    return <Preloader />;
  }

  return (
    <div className={styles.container}>
      <h2 className={`text text_type_main-large ${styles.title}`}>
        Детали ингредиента
      </h2>
      <IngredientDetailsUI ingredientData={ingredientData} />
    </div>
  );
};
